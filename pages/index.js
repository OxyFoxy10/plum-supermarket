import Head from 'next/head'
// import * as React from "react";
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.scss'
import { useSession, signIn, signOut } from "next-auth/react"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession()
  return (
    <div className='styles.container'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <h1 className={styles.red}>Wellcome</h1>
    {session? "you are logged in": "you are not logged in"}
    </div>
  )
}
