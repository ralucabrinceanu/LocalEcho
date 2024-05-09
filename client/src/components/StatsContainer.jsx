import React from 'react'
import { BiVideoRecording } from 'react-icons/bi'
import { CiCircleQuestion } from 'react-icons/ci'
import { GoVerified } from 'react-icons/go'
import { MdSchedule } from 'react-icons/md'
import { MdOutlineCancel } from 'react-icons/md'
import Wrapper from '../assets/wrappers/StatsContainer'
import StatItem from './StatItem'

const StatsContainer = ({ defaultStats }) => {
  const stats = [
    {
      title: 'live events',
      count: defaultStats?.RIGHT_NOW || 0,
      icon: <BiVideoRecording />,
      color: '#c010a3',
      bcg: '#dfafd7',
    },
    {
      title: 'scheduled events',
      count: defaultStats?.SCHEDULED || 0,
      icon: <MdSchedule />,
      color: '#f59e0b',
      bcg: '#fef3c7',
    },
    {
      title: 'on hold events',
      count: defaultStats?.ON_HOLD || 0,
      icon: <CiCircleQuestion />,
      color: '#545dda',
      bcg: '#c2bbe7',
    },
    {
      title: 'completed events',
      count: defaultStats?.COMPLETED || 0,
      icon: <GoVerified />,
      color: '#13a34a',
      bcg: '#90d8ac',
    },
    {
      title: 'cancelled events',
      count: defaultStats?.CANCELLED || 0,
      icon: <MdOutlineCancel />,
      color: '#c92f37',
      bcg: '#e0a6a9',
    },
  ]
  // TODO REACT: event categories

  return (
    <Wrapper>
      {stats.map((item) => {
        return <StatItem key={item.title} {...item} />
      })}
    </Wrapper>
  )
}

export default StatsContainer
