'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

// 更新导航项，适用于PDF2PIC项目
const navigation: {name: string, href: string}[] = [
  // 空数组，无导航项
]

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between [padding:1.5rem] lg:[padding-inline:2rem]">
          <div className="flex lg:[flex:1]">
            <a href="#" className="[margin:-1.5rem] [padding:1.5rem]">
              <span className="sr-only">PDF2PIC</span>
              <Image 
                src="/pdf.svg" 
                alt="PDF Icon" 
                width={32} 
                height={32}
              />
            </a>
          </div>
          <div className="flex lg:[display:none]">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="[margin:-2.5rem] inline-flex items-center justify-center rounded-md [padding:2.5rem] text-gray-700"
            >
              <span className="sr-only">打开主菜单</span>
              <Bars3Icon className="[width:1.5rem] [height:1.5rem]" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:[display:flex] lg:[gap:3rem]">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold [line-height:1.5rem] text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:[display:flex] lg:[flex:1] lg:justify-end">
            <a href="/app" className="text-sm font-semibold [line-height:1.5rem] text-gray-900">
              首页 <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:[display:none]">
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white [padding-inline:1.5rem] [padding-block:1.5rem] sm:[max-width:24rem] sm:[ring-width:1px] sm:[ring-color:rgb(229,231,235)]">
            <div className="flex items-center justify-between">
              <a href="#" className="[margin:-1.5rem] [padding:1.5rem]">
                <span className="sr-only">PDF2PIC</span>
                <Image 
                  src="/pdf.svg" 
                  alt="PDF Icon" 
                  width={32} 
                  height={32}
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="[margin:-2.5rem] rounded-md [padding:2.5rem] text-gray-700"
              >
                <span className="sr-only">关闭菜单</span>
                <XMarkIcon className="[width:1.5rem] [height:1.5rem]" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="[margin-block:-1.5rem] divide-y divide-gray-500/10">
                <div className="[gap:0.5rem] [padding-block:1.5rem]">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="[margin-inline:-0.75rem] block rounded-lg [padding-inline:0.75rem] [padding-block:0.5rem] text-base font-semibold [line-height:1.75rem] text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="[padding-block:1.5rem]">
                  <a
                    href="/app"
                    className="[margin-inline:-0.75rem] block rounded-lg [padding-inline:0.75rem] [padding-block:0.625rem] text-base font-semibold [line-height:1.75rem] text-gray-900 hover:bg-gray-50"
                  >
                    首页
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <div className="relative isolate [padding-top:3.5rem]">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 [top:-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:[top:-20rem]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] [width:36.125rem] [transform:translateX(-50%)] rotate-[30deg] [background:linear-gradient(to_right_top,#ff80b5,#9089fc)] opacity-30 sm:left-[calc(50%-30rem)] sm:[width:72.1875rem]"
          />
        </div>
        <div className="[padding-block:6rem_8rem] lg:[padding-bottom:10rem]">
          <div className="mx-auto max-w-7xl [padding-inline:1.5rem] lg:[padding-inline:2rem]">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                PDF转长图 <span className="text-blue-600">一步搞定</span>
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl">
                PDF2PIC提供简单高效的PDF转长图工具，支持多页PDF拼接和自定义尾部图片，让您的文档分享更加便捷。
              </p>
              <div className="mt-10 flex items-center justify-center [gap:1.5rem]">
                <a
                  href="/app"
                  className="rounded-md bg-blue-600 [padding-inline:0.875rem] [padding-block:0.625rem] text-sm font-semibold text-white shadow-xs hover:bg-blue-500 [outline-offset:2px] focus-visible:[outline:2px_solid_#4338ca]"
                >
                  开始体验
                </a>
                <a href="#features" className="text-sm font-semibold [line-height:1.5rem] text-gray-900">
                  了解更多 <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="rounded-xl [background:transparent] [padding:0.5rem] lg:rounded-2xl lg:[padding:1rem]">
                <img
                  alt="PDF2PIC应用截图"
                  src="/preview.png"
                  width={2432}
                  height={1442}
                  className="rounded-md shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] [width:36.125rem] [transform:translateX(-50%)] [background:linear-gradient(to_right_top,#ff80b5,#9089fc)] opacity-30 sm:left-[calc(50%+36rem)] sm:[width:72.1875rem]"
          />
        </div>
      </div>
    </div>
  )
}
