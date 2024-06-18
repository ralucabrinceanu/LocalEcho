import { StatusCodes } from 'http-status-codes'
import cloudinary from 'cloudinary'
import { promises as fs } from 'fs'
import dayjs from 'dayjs'
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/customErrors.js'
import { PrismaClient } from '@prisma/client'
import { EventStatus, EventCategory } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllEvents = async (req, res) => {
  const { search, eventCategory, rightnow, city } = req.query
  const queryObject = {}

  if (search) {
    queryObject.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (
    eventCategory &&
    eventCategory !== 'all' &&
    Object.values(EventCategory).includes(eventCategory)
  ) {
    queryObject.eventCategory = eventCategory
  }

  // checkbox
  if (rightnow === 'on') {
    const currentDate = new Date()
    queryObject.startDate = { lte: currentDate }
    queryObject.endDate = { gte: currentDate }
  }

  // get cities
  const cities = await prisma.venues.findMany({
    distinct: ['city'],
    select: {
      city: true,
    },
  })
  const cityNames = cities.map((venue) => venue.city)
  const citiesWithAllOption = ['all', ...cityNames]

  if (city && city !== 'all' && citiesWithAllOption.includes(city)) {
    const venuesInCity = await prisma.venues.findMany({
      where: {
        city: city,
      },
      select: {
        id: true,
      },
    })
    // console.log(venuesInCity)
    const venueIds = venuesInCity.map((venue) => venue.id)
    // console.log(venueIds)
    if (venueIds.length > 0) {
      queryObject.venueId = {
        in: venueIds,
      }
    } else {
      queryObject.venueId = {
        in: [],
      }
    }
    // console.log(queryObject)
  }

  // setup pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 3 //! schimba
  const skip = (page - 1) * limit

  const events = await prisma.events.findMany({
    where: queryObject,
    // orderBy: { [sortBy]: sortOrder },
    take: limit,
    skip: skip,
  })

  const totalEvents = await prisma.events.count({
    where: queryObject,
  })
  // console.log('total events:', totalEvents)

  const numOfPages = Math.ceil(totalEvents / limit)

  res.status(StatusCodes.OK).json({
    meta: {
      pagination: { totalEvents, numOfPages, currentPage: page },
      categories: ['all', ...Object.values(EventCategory)],
      cities: citiesWithAllOption,
    },
    events,
  })
}

export const getUserEvents = async (req, res) => {
  const user = await prisma.users.findUnique({ where: { id: req.user.userId } })
  if (!user) throw new NotFoundError(`No user with id ${id}`)

  const events = await prisma.events.findMany({
    where: { createdById: user.id },
  })
  if (!events) throw new NotFoundError(`No events created by ${user}`)

  res.status(StatusCodes.OK).json({ events })
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
    image,
    imagePublicId,
  } = req.body
  req.body.createdById = req.user.userId

  const venue = await prisma.venues.findUnique({ where: { id: venueId } })
  if (!venue) throw new NotFoundError(`No venue with id ${venueId}`)

  let addEventData = { ...req.body }
  addEventData.createdAt = new Date()

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path)
    await fs.unlink(req.file.path)
    addEventData.image = response.secure_url
    addEventData.imagePublicId = response.public_id
  }
  console.log('ADD EVENT DATA', addEventData)

  const event = await prisma.events.create({
    data: addEventData,
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
    image,
    imagePublicId,
  } = req.body

  const venue = await prisma.venues.findUnique({ where: { id: venueId } })
  if (!venue) throw new NotFoundError(`No venue with id ${venueId}`)
  const venueIdDb = venue.id

  const event = await prisma.events.findUnique({ where: { id } })
  if (!event) throw new NotFoundError(`No event with id ${id}`)

  if (event.createdById !== req.user.userId && req.user.role[0] != 'ADMIN')
    throw new UnauthorizedError('Not authorized to update this event')

  let updatedEventData = { ...req.body }
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path)
    await fs.unlink(req.file.path)
    updatedEventData.image = response.secure_url
    updatedEventData.imagePublicId = response.public_id
  }
  if (req.file && event.imagePublicId) {
    await cloudinary.v2.uploader.destroy(event.imagePublicId)
  }

  // const updatedEvent = await prisma.events.update({
  //   where: { id },
  //   data: {
  //     title,
  //     description,
  //     startDate,
  //     endDate,
  //     venueId: venueIdDb,
  //     eventStatus,
  //     eventCategory,
  //   },
  // })

  const updatedEvent = await prisma.events.update({
    where: { id },
    data: updatedEventData,
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
  const currentDate = new Date()

  const currentEvents = await prisma.events.findMany({
    where: {
      AND: [
        { startDate: { lte: currentDate } },
        { endDate: { gte: currentDate } },
      ],
    },
  })

  const overdueEvents = await prisma.events.findMany({
    where: {
      endDate: { lt: currentDate },
    },
  })

  await Promise.all([
    ...currentEvents.map(async (event) => {
      await prisma.events.update({
        where: { id: event.id },
        data: { eventStatus: 'RIGHT_NOW' },
      })
    }),
    ...overdueEvents.map(async (event) => {
      await prisma.events.update({
        where: { id: event.id },
        data: { eventStatus: 'COMPLETED' },
      })
    }),
  ])
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
  }

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
