import React from 'react'
import MainBanner from '../components/uilayouts/MainBanner'
import Categories from '../components/uilayouts/Categories'
import BestSeller from '../components/uilayouts/BestSeller'
import BottomBanner from '../components/uilayouts/BottomBanner'
import NewsLetter from '../components/uilayouts/NewsLetter'

const HomPage = () => {
  return (
    <div className='mt-10'>
        <MainBanner/>
        <Categories/>
        <BestSeller/>
        <BottomBanner/>
        <NewsLetter/>
    </div>
  )
}

export default HomPage