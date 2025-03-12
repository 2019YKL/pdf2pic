'use client';

import { useState, useRef, useEffect } from 'react';
import { renderPDF, createLongImage } from '@/lib/pdfProcessor';

export default function PDFUploader() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [tailFile, setTailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [hasCachedTail, setHasCachedTail] = useState(false);
  
  const dropzoneRef = useRef<HTMLDivElement>(null);

  // 检查是否有缓存的尾部图片
  useEffect(() => {
    try {
      const cachedTailData = localStorage.getItem('pdf2pic-tail');
      if (cachedTailData) {
        try {
          const dataBlob = dataURItoBlob(cachedTailData);
          const file = new File([dataBlob], 'cached-tail.png', { type: 'image/png' });
          setTailFile(file);
          setHasCachedTail(true);
          console.log('已加载缓存的尾部图片');
        } catch (err) {
          console.error('无法加载缓存的尾部图片:', err);
          setError('无法加载缓存的尾部图片');
          setErrorDetails(err instanceof Error ? err.message : String(err));
        }
      }
    } catch (error) {
      console.error('无法访问localStorage:', error);
      setError('无法访问本地存储');
      setErrorDetails(error instanceof Error ? error.message : String(error));
    }
  }, []);

  // 将 Data URI 转换为 Blob
  const dataURItoBlob = (dataURI: string) => {
    try {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      return new Blob([ab], { type: mimeString });
    } catch (error) {
      console.error('Data URI 转换为 Blob 失败:', error);
      throw new Error(`Data URI 转换失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // 处理文件拖放
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.add('border-blue-500');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('border-blue-500');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('border-blue-500');
    }
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (files[0].type === 'application/pdf') {
        setPdfFile(files[0]);
        setError(null);
        setErrorDetails(null);
        console.log(`已通过拖放选择PDF文件: ${files[0].name}, 大小: ${(files[0].size / 1024 / 1024).toFixed(2)}MB`);
      } else {
        setError('请上传PDF文件');
        setErrorDetails(`文件类型错误: ${files[0].type}，请上传PDF文件`);
        console.error(`文件类型错误: ${files[0].type}，请上传PDF文件`);
      }
    }
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0].type === 'application/pdf') {
        setPdfFile(files[0]);
        setError(null);
        setErrorDetails(null);
        console.log(`已选择PDF文件: ${files[0].name}, 大小: ${(files[0].size / 1024 / 1024).toFixed(2)}MB`);
      } else {
        setError('请上传PDF文件');
        setErrorDetails(`文件类型错误: ${files[0].type}，请上传PDF文件`);
        console.error(`文件类型错误: ${files[0].type}，请上传PDF文件`);
      }
    }
  };

  // 处理尾部文件选择
  const handleTailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0].type === 'image/png') {
        setTailFile(files[0]);
        console.log(`已选择尾部PNG文件: ${files[0].name}, 大小: ${(files[0].size / 1024 / 1024).toFixed(2)}MB`);
        
        // 缓存尾部文件
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            try {
              localStorage.setItem('pdf2pic-tail', event.target.result);
              setHasCachedTail(true);
              console.log('尾部图片已缓存到本地存储');
            } catch (error) {
              console.error('无法存储到localStorage:', error);
              setError('无法缓存尾部图片');
              setErrorDetails(error instanceof Error ? error.message : String(error));
            }
          }
        };
        reader.onerror = (event) => {
          console.error('读取尾部文件失败:', event);
          setError('读取尾部文件失败');
          setErrorDetails('FileReader 错误');
        };
        reader.readAsDataURL(files[0]);
      } else {
        setError('请上传PNG格式的尾部图片');
        setErrorDetails(`尾部文件类型错误: ${files[0].type}，请上传PNG文件`);
        console.error(`尾部文件类型错误: ${files[0].type}，请上传PNG文件`);
      }
    }
  };

  // 清除缓存的尾部图片
  const clearCachedTail = () => {
    try {
      localStorage.removeItem('pdf2pic-tail');
      setTailFile(null);
      setHasCachedTail(false);
      console.log('已清除缓存的尾部图片');
    } catch (error) {
      console.error('无法访问localStorage:', error);
      setError('无法清除尾部图片缓存');
      setErrorDetails(error instanceof Error ? error.message : String(error));
    }
  };

  // 开始转换过程
  const handleConvert = async () => {
    if (!pdfFile) {
      setError('请先上传PDF文件');
      return;
    }

    setConverting(true);
    setProgress(0);
    setError(null);
    setErrorDetails(null);
    setPreviewUrl(null);
    console.log('开始PDF转换过程...');

    try {
      // 检查PDF文件的MIME类型
      if (pdfFile.type !== 'application/pdf') {
        throw new Error(`文件类型错误: ${pdfFile.type}，请上传PDF文件`);
      }
      
      // 转换 PDF 为长图
      console.log(`处理PDF文件: ${pdfFile.name}, 大小: ${(pdfFile.size / 1024 / 1024).toFixed(2)}MB`);
      if (tailFile) {
        console.log(`处理尾部文件: ${tailFile.name}, 大小: ${(tailFile.size / 1024 / 1024).toFixed(2)}MB`);
      }
      
      const result = await createLongImage(pdfFile, tailFile, (p) => {
        setProgress(Math.round(p * 100));
      });
      
      setPreviewUrl(result);
      console.log('PDF转换完成，已生成预览');
    } catch (err) {
      console.error('转换过程中出错:', err);
      setError('转换过程中出错，请重试');
      setErrorDetails(err instanceof Error ? err.message : String(err));
    } finally {
      setConverting(false);
      setProgress(100);
    }
  };

  // 下载生成的图片
  const handleDownload = () => {
    if (!previewUrl) return;

    try {
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = `${pdfFile?.name.replace('.pdf', '') || 'pdf2pic'}_长图.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('长图下载已触发');
    } catch (error) {
      console.error('下载长图失败:', error);
      setError('下载长图失败');
      setErrorDetails(error instanceof Error ? error.message : String(error));
    }
  };

  // 左侧区域 - 功能控制区
  const FunctionalPanel = () => (
    <div className="w-full md:max-w-md space-y-6">
      <div 
        ref={dropzoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="mb-4 flex min-h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 transition-colors hover:border-blue-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-500 mb-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="mb-2 text-center">拖拽PDF文件到此处，或</p>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange}
          className="hidden" 
          id="pdf-upload" 
        />
        <label 
          htmlFor="pdf-upload" 
          className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-all"
        >
          选择文件
        </label>
        {pdfFile && (
          <p className="mt-2 text-emerald-600 text-sm text-center">
            已选择: {pdfFile.name} <br />({(pdfFile.size / 1024 / 1024).toFixed(2)}MB)
          </p>
        )}
      </div>

      <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h3 className="mb-4 text-lg font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
          </svg>
          尾部图片设置
        </h3>
        {hasCachedTail ? (
          <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-100">
            <p className="text-emerald-700 text-sm">已加载缓存的尾部图片 {tailFile && `(${tailFile.name.length > 20 ? tailFile.name.substring(0, 20) + '...' : tailFile.name})`}</p>
            <button 
              onClick={clearCachedTail}
              className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600 transition-all shadow-sm"
            >
              清除
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <input 
              type="file" 
              accept="image/png" 
              onChange={handleTailFileChange}
              className="hidden" 
              id="tail-upload" 
            />
            <label 
              htmlFor="tail-upload" 
              className="flex items-center cursor-pointer rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              选择尾部图片 (PNG)
            </label>
          </div>
        )}
      </div>

      <button
        onClick={handleConvert}
        disabled={!pdfFile || converting}
        className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 font-medium text-white hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 shadow-sm hover:shadow transition-all"
      >
        {converting ? (
          <div className="flex items-center justify-center">
            <div className="loading-spinner mr-2"></div>
            <span>转换中... {progress}%</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            开始转换
          </div>
        )}
      </button>

      {converting && (
        <div className="mb-4">
          <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div 
              className="h-full rounded-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-xs text-slate-500">{progress}%</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 border border-red-100">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="font-medium">{error}</p>
              {errorDetails && (
                <div className="mt-2">
                  <p className="text-xs text-red-600 overflow-auto max-h-24 bg-red-50 p-2 rounded">{errorDetails}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 右侧区域 - 预览和下载
  const PreviewPanel = () => (
    <div className="w-full md:border-l border-slate-100 md:pl-6 mt-8 md:mt-0">
      <h3 className="mb-4 text-lg font-medium flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        预览
      </h3>
      
      {previewUrl ? (
        <div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 md:h-[400px] overflow-y-auto">
            <img 
              src={previewUrl} 
              alt="转换后的长图预览" 
              className="w-full rounded shadow-sm" 
            />
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleDownload}
              className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 font-medium text-white hover:from-emerald-600 hover:to-emerald-700 shadow-sm hover:shadow transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              下载长图
            </button>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg">
          <div className="text-center text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p>转换完成后将在此处显示预览</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:space-x-6">
        <FunctionalPanel />
        <PreviewPanel />
      </div>
    </div>
  );
}
