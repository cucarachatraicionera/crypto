"use client"

import Banner from './components/Banner/index';
import Companies from './components/Companies/index';
import Work from './components/Work/index';
import Table from './components/Table/index';
import Features from './components/Features/index';
import Simple from './components/Simple/index';
import Trade from './components/Trade/index';
import Faq from './components/Faq/index';
import SwapButton from './components/SwapButton';


export default function Home() {
  return (
    <main>
      <Banner />
      <Companies />
      <Work />
      <SwapButton recipient="7ZpJZSKGxhvz9EZx1kF9rbMEke9bVBDLqRtdR7zZDVUo" amount={0.01} />
      <Table />
      <Features />
      <Simple />
      <Trade />
      <Faq />
    </main>
  )
}
