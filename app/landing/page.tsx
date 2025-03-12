'use client'

import Hero from '@/components/Hero'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      
      {/* Features section can be added here */}
      <div id="features" className="[padding-top:3rem] [padding-bottom:6rem] bg-white">
        <div className="mx-auto max-w-7xl [padding-inline:1.5rem] lg:[padding-inline:2rem]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">主要功能</h2>
            <p className="mt-6 text-lg text-gray-600">
              简单直观的界面，强大的PDF处理能力
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold text-gray-900">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                    </svg>
                  </div>
                  PDF转长图
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base text-gray-600">
                  <p className="flex-auto">
                    将多页PDF文档智能拼接为单一长图，方便在社交媒体分享或移动设备查看。
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold text-gray-900">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                  </div>
                  高品质输出
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base text-gray-600">
                  <p className="flex-auto">
                    保持原始PDF的高清晰度和精确布局，确保转换后的图片清晰可读。
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold text-gray-900">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
                    </svg>
                  </div>
                  尾部图片添加
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base text-gray-600">
                  <p className="flex-auto">
                    支持添加自定义尾部图片，为您的文档增加品牌标识或个性化元素。
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl [padding-block:3rem] [padding-inline:1.5rem] lg:[padding-inline:2rem]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">准备好开始了吗？</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
              立即尝试我们的PDF转长图工具，体验简单高效的文档转换。
            </p>
            <div className="mt-10 flex items-center justify-center [gap-inline:1rem]">
              <a
                href="/app"
                className="rounded-md bg-blue-600 [padding-inline:1.5rem] [padding-block:0.75rem] text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:[outline:2px_solid_transparent] focus-visible:[outline-offset:2px]"
              >
                开始体验
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl [padding-block:3rem] [padding-inline:1.5rem] lg:[padding-inline:2rem]">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {new Date().getFullYear()} PDF2PIC. 保留所有权利。
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
