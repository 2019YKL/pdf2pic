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
          const file = new File([dataBlob], 'cached-tail.pdf', { type: 'application/pdf' });
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
      if (files[0].type === 'application/pdf') {
        setTailFile(files[0]);
        console.log(`已选择尾部PDF文件: ${files[0].name}, 大小: ${(files[0].size / 1024 / 1024).toFixed(2)}MB`);
        
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
        setError('请上传PDF格式的尾部图片');
        setErrorDetails(`尾部文件类型错误: ${files[0].type}，请上传PDF文件`);
        console.error(`尾部文件类型错误: ${files[0].type}，请上传PDF文件`);
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

  return (
    <div className="w-full">
      <div 
        ref={dropzoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="mb-4 flex min-h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400"
      >
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
          className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          选择文件
        </label>
        {pdfFile && (
          <p className="mt-2 text-green-600">已选择: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)}MB)</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium">尾部图片设置</h3>
        {hasCachedTail ? (
          <div className="flex items-center justify-between">
            <p className="text-green-600">已加载缓存的尾部图片 {tailFile && `(${tailFile.name}, ${(tailFile.size / 1024 / 1024).toFixed(2)}MB)`}</p>
            <button 
              onClick={clearCachedTail}
              className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
              清除
            </button>
          </div>
        ) : (
          <div>
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleTailFileChange}
              className="hidden" 
              id="tail-upload" 
            />
            <label 
              htmlFor="tail-upload" 
              className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              选择尾部图片 (PDF)
            </label>
          </div>
        )}
      </div>

      <button
        onClick={handleConvert}
        disabled={!pdfFile || converting}
        className="mb-6 w-full rounded-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
      >
        {converting ? `转换中... ${progress}%` : '开始转换'}
      </button>

      {converting && (
        <div className="mb-4">
          <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div 
              className="h-full rounded-full bg-blue-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm">{progress}%</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          <p className="font-bold">错误:</p>
          <p>{error}</p>
          {errorDetails && (
            <div className="mt-2">
              <p className="font-bold">详细信息:</p>
              <p className="text-sm overflow-auto max-h-24">{errorDetails}</p>
            </div>
          )}
        </div>
      )}

      {previewUrl && (
        <div className="mt-6">
          <h3 className="mb-4 text-xl font-bold">预览</h3>
          <div className="mb-4 max-h-[500px] overflow-y-auto">
            <img 
              src={previewUrl} 
              alt="转换后的长图预览" 
              className="w-full rounded-lg shadow-lg" 
            />
          </div>
          <button
            onClick={handleDownload}
            className="w-full rounded-lg bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
          >
            下载长图
          </button>
        </div>
      )}
    </div>
  );
}
