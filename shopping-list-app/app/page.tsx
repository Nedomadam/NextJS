"use client";
import Image from 'next/image'
import styles from './page.module.css'
import { useState } from 'react'
import { Console } from 'console'
import Navbar from '@/components/navbar'



export default function Home() {
  const [items, setItems] = useState()

  const populateItems = async () =>  {
    const res = await fetch("/api/items")
    res.json()
    setItems(res.items)
    console.log(items);
  }
  return (
    <>
      <Navbar></Navbar>
      <main className={styles.main}>
        <h2>Shopping list</h2>
      </main>
    </>
  )
}
