import { StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import { NotFoundError, UnauthorizedError } from '../errors/customErrors.js'
import { PrismaClient } from '@prisma/client'
import { EventStatus, EventCategory } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllEvents = async (req, res) => {
  const { search, eventStatus, eventCategory, sort } = req.query
  console.log('sort:', sort)
  const queryObject = {
    // createdById: req.user.userId,
    // AM COMENTAT ASTA CA NU AFISA TOATE EVEN
  }

  if (search) {
    queryObject.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (
    eventStatus &&
    eventStatus !== 'all' &&
    Object.values(EventStatus).includes(eventStatus)
  ) {
    queryObject.eventStatus = eventStatus
  }

  if (
    eventCategory &&
    eventCategory !== 'all' &&
    Object.values(EventCategory).includes(eventCategory)
  ) {
    queryObject.eventCategory = eventCategory
  }

  const sortOptions = {
    startDat: 'startDate',
    endDat: 'endDate',
    'a-z': 'eventCategory',
    'z-a': 'eventCategory',
  }
  const sortDirections = {
    endDat: 'desc',
    'a-z': 'asc',
    'z-a': 'desc',
  }
  const sortBy = sortOptions[sort] || sortOptions.startDat
  console.log('sort by: ', sortBy)
  const sortOrder = sortDirections[sort] || 'asc'
  console.log('sort order: ', sortOrder)

  // setup pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 5
  const skip = (page - 1) * limit

  const events = await prisma.events.findMany({
    where: queryObject,
    orderBy: { [sortBy]: sortOrder },
    take: limit,
    skip: skip,
    // take: 2,
    // skip: 1,
  })

  const totalEvents = await prisma.events.count({
    where: queryObject,
  })
  console.log('total events:', totalEvents)

  const numOfPages = Math.ceil(totalEvents / limit)

  res
    .status(StatusCodes.OK)
    .json({ totalEvents, numOfPages, currentPage: page, events })
}

export const createEvent = async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    venueId,
    eventStatus,
    eventCategory,
  } = req.body
  req.body.createdById = req.user.userId

  const venue = await prisma.venues.findUnique({ where: { id: venueId } })
  if (!venue) throw new NotFoundError(`No venue with id ${venueId}`)
  const venueIdDb = venue.id

  const event = await prisma.events.create({
    data: {
      title,
      description,
      startDate,
      endDate,
      venueId: venueIdDb,
      eventStatus,
      eventCategory,
      createdById: req.body.createdById,
    },
  })
  res.status(StatusCodes.CREATED).json({ event })
}

export const getEvent = async (req, res) => {
  const { id } = req.params
  const event = await prisma.events.findUnique({ where: { id } })
  if (!event) throw new NotFoundError(`No event with id ${id}`)
  res.status(StatusCodes.OK).json({ event })
}

export const updateEvent = async (req, res) => {
  const { id } = req.params
  const {
    title,
    description,
    startDate,
    endDate,
    venueId,
    eventStatus,
    eventCategory,
  } = req.body

  const venue = await prisma.venues.findUnique({ where: { id: venueId } })
  if (!venue) throw new NotFoundError(`No venue with id ${venueId}`)
  const venueIdDb = venue.id

  const event = await prisma.events.findUnique({ where: { id } })
  if (!event) throw new NotFoundError(`No event with id ${id}`)

  if (event.createdById !== req.user.userId && req.user.role[0] != 'ADMIN')
    throw new UnauthorizedError('Not authorized to update this event')

  const updatedEvent = await prisma.events.update({
    where: { id },
    data: {
      title,
      description,
      startDate,
      endDate,
      venueId: venueIdDb,
      eventStatus,
      eventCategory,
    },
  })
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Event modified', event: updatedEvent })
}

export const deleteEvent = async (req, res) => {
  const { id } = req.params

  const event = await prisma.events.findUnique({
    where: { id },
  })
  if (!event) throw new NotFoundError(`No event with id ${id}`)

  if (event.createdById !== req.user.userId && req.user.role[0] != 'ADMIN')
    throw new UnauthorizedError('Not authorized to delete this event')

  const deletedEvent = await prisma.events.delete({ where: { id } })
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Event deleted successfully', event: deletedEvent })
}

export const updateEventStatus = async () => {
  const currentEvents = await prisma.events.findMany({
    where: {
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
      eventStatus: 'SCHEDULED',
    },
  })

  await Promise.all(
    currentEvents.map(async (event) => {
      await prisma.events.update({
        where: { id: event.id },
        data: { eventStatus: 'RIGHT_NOW' },
      })
    })
  )

  const overdueEvents = await prisma.events.findMany({
    where: {
      endDate: { lte: new Date() },
      eventStatus: { in: ['COMPLETED', 'RIGHT_NOW'] },
    },
  })

  await Promise.all(
    overdueEvents.map(async (event) => {
      await prisma.events.update({
        where: { id: event.id },
        data: { eventStatus: 'COMPLETED' },
      })
    })
  )
}
setInterval(updateEventStatus, 60 * 1000)

export const showStats = async (req, res) => {
  const stats = await prisma.events.groupBy({
    by: ['eventStatus'],
    _count: true,
    where: {
      createdById: req.user.userId,
    },
  })

  const formattedStats = stats.reduce((acc, curr) => {
    const { eventStatus, _count: count } = curr
    acc[eventStatus] = count
    return acc
  }, {})

  const defaultStats = {
    CANCELLED: formattedStats.CANCELLED || 0,
    RIGHT_NOW: formattedStats.RIGHT_NOW || 0,
    SCHEDULED: formattedStats.SCHEDULED || 0,
    COMPLETED: formattedStats.COMPLETED || 0,
    ON_HOLD: formattedStats.ON_HOLD || 0,
  }

  // const events = await prisma.events.findMany({
  //   where: {
  //     createdById: req.user.userId,
  //   },
  // })

  // const monthlyEvents = {}

  // events.forEach((event) => {
  //   const startDate = new Date(event.startDate)
  //   const year = startDate.getFullYear()
  //   const month = startDate.getMonth() + 1

  //   const key = `${year}-${month}`
  //   if (monthlyEvents[key]) {
  //     monthlyEvents[key] += 1
  //   } else {
  //     monthlyEvents[key] = 1
  //   }
  // })

  // Sort monthlyEvents by year and month
  // const sortedMonthlyEvents = Object.entries(monthlyEvents)
  //   .sort(([keyA], [keyB]) => {
  //     return keyB.localeCompare(keyA) // Sort in descending order
  //   })
  //   .slice(0, 6) // Take the latest 6 months
  //   .map(([key, count]) => {
  //     const [year, month] = key.split('-')
  //     const date = dayjs()
  //       .month(parseInt(month) - 1)
  //       .year(parseInt(year))
  //       .format('MMM YY')
  //     return { date, count }
  //   })
  // console.log(sortedMonthlyEvents)

  // v2
  const monthlyEvents = await prisma.$queryRaw`
    SELECT
      EXTRACT(YEAR FROM "start_date") AS "year",
      EXTRACT(MONTH FROM "start_date") AS "month",
      COUNT(*)::int AS "count"
    FROM
      "events"
    WHERE
      "created_by" = ${req.user.userId}
    GROUP BY
      EXTRACT(YEAR FROM "start_date"),
      EXTRACT(MONTH FROM "start_date")
    ORDER BY
      "year" DESC,
      "month" DESC
    LIMIT
      6
  `
  const formattedMonthlyEvents = monthlyEvents
    .map((item) => {
      const { year, month, count } = item
      const date = dayjs()
        .month(month - 1)
        .year(year)
        .format('MMM YY')
      return { date, count }
    })
    .reverse()
  // console.log(formattedMonthlyEvents)

  // Event Categories
  const eventCategoryStatsQuery = {
    by: ['eventCategory'],
    _count: true,
    where: {
      createdById: req.user.userId,
    },
  }

  const categoryStats = await prisma.events.groupBy(eventCategoryStatsQuery)

  const formattedCategoryStats = categoryStats.reduce((acc, curr) => {
    const { eventCategory, _count: count } = curr
    acc[eventCategory] = count
    return acc
  }, {})

  const defaultCategoryStats = {
    MUSIC: formattedCategoryStats.MUSIC || 0,
    ART_AND_CULTURE: formattedCategoryStats.ART_AND_CULTURE || 0,
    FOOD_AND_DRINK: formattedCategoryStats.FOOD_AND_DRINK || 0,
    FAMILY_AND_KIDS: formattedCategoryStats.FAMILY_AND_KIDS || 0,
    CHARITY: formattedCategoryStats.CHARITY || 0,
    HEALTH_AND_WELLNESS: formattedCategoryStats.HEALTH_AND_WELLNESS || 0,
  }

  res
    .status(StatusCodes.OK)
    .json({ defaultStats, monthlyEvents, defaultCategoryStats })
}
