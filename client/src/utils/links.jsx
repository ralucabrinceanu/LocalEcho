import React from 'react'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { RiSearchLine } from 'react-icons/ri'
import { MdAdd } from 'react-icons/md'
import { IoStatsChartOutline } from 'react-icons/io5'
import { RiAccountCircleLine } from 'react-icons/ri'

const links = [
  {
    text: 'add event',
    path: '.',
    icon: <MdAdd />,
  },
  {
    text: 'all events',
    path: 'all-events',
    icon: <RiSearchLine />,
  },
  {
    text: 'stats',
    path: 'stats',
    icon: <IoStatsChartOutline />,
  },
  {
    text: 'profile',
    path: 'profile',
    icon: <RiAccountCircleLine />,
  },
  {
    text: 'admin',
    path: 'admin',
    icon: <MdOutlineAdminPanelSettings />,
  },
]

export default links
