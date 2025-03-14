import * as pdfjs from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

// 使用本地托管的 worker 文件
console.log(`PDF.js 版本: ${pdfjs.version}`);

// 在浏览器环境中初始化worker
if (typeof window !== 'undefined') {
  try {
    // 直接使用相对于public目录的路径
    // 必须确保该文件在public目录中
    const publicWorkerPath = `/pdf.worker.min.mjs`;
    console.log(`设置 PDF.js worker 路径: ${publicWorkerPath}`);
    pdfjs.GlobalWorkerOptions.workerSrc = publicWorkerPath;
  } catch (error) {
    console.error('设置 PDF.js worker 路径失败:', error);
  }
} else {
  console.log('非浏览器环境，跳过 Worker 初始化');
}

// 最大处理页数
const MAX_PAGES = 30;
// 最大文件大小 (MB)
const MAX_FILE_SIZE_MB = 5;

/**
 * 从文件加载 PDF 文档
 */
export async function loadPDF(file: File): Promise<PDFDocumentProxy> {
  console.log(`开始加载PDF文件: ${file.name}, 大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    console.log(`成功读取文件内容到 ArrayBuffer, 大小: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
    
    const loadingTask = pdfjs.getDocument(arrayBuffer);
    console.log('PDF.js 加载任务已创建，等待处理...');
    
    const pdf = await loadingTask.promise;
    console.log(`PDF 加载成功, 页数: ${pdf.numPages}`);
    
    return pdf;
  } catch (error) {
    console.error('PDF 加载失败:', error);
    throw new Error(`PDF 加载失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 渲染单个 PDF 页面到 Canvas
 */
export async function renderPage(
  page: PDFPageProxy, 
  scale: number = 1.5,
  targetWidth?: number
): Promise<HTMLCanvasElement> {
  console.log(`开始渲染页面 ${page.pageNumber}, 缩放比例: ${scale}`);
  
  try {
    // 如果提供了目标宽度，计算适当的缩放比例
    let finalScale = scale;
    if (targetWidth) {
      const originalViewport = page.getViewport({ scale: 1.0 });
      finalScale = targetWidth / originalViewport.width;
      console.log(`基于目标宽度 ${targetWidth}px 计算出缩放比例: ${finalScale}`);
    }
    
    const viewport = page.getViewport({ scale: finalScale });
    console.log(`页面 ${page.pageNumber} 视口大小: ${viewport.width}x${viewport.height}`);
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('无法创建 canvas 上下文');
    }
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    console.log(`开始渲染页面 ${page.pageNumber} 到 canvas...`);
    await page.render(renderContext).promise;
    console.log(`页面 ${page.pageNumber} 渲染完成`);
    
    return canvas;
  } catch (error) {
    console.error(`渲染页面 ${page.pageNumber} 失败:`, error);
    throw new Error(`渲染页面 ${page.pageNumber} 失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 渲染完整 PDF 文档到多个 Canvas
 */
export async function renderPDF(
  pdf: PDFDocumentProxy, 
  targetWidth?: number,
  progressCallback?: (progress: number) => void,
  pageLimit?: number
): Promise<HTMLCanvasElement[]> {
  // 如果提供了自定义页数限制，使用它，否则使用默认的 MAX_PAGES
  const effectivePageLimit = pageLimit || MAX_PAGES;
  const numPages = Math.min(pdf.numPages, effectivePageLimit);
  console.log(`开始渲染PDF, 总页数: ${pdf.numPages}, 将渲染: ${numPages} 页`);
  
  const canvases: HTMLCanvasElement[] = [];
  
  try {
    for (let i = 1; i <= numPages; i++) {
      console.log(`获取页面 ${i}/${numPages}...`);
      const page = await pdf.getPage(i);
      
      console.log(`渲染页面 ${i}/${numPages}...`);
      const canvas = await renderPage(page, 1.5, targetWidth);
      canvases.push(canvas);
      
      if (progressCallback) {
        const progress = i / numPages;
        console.log(`渲染进度: ${Math.round(progress * 100)}%`);
        progressCallback(progress);
      }
    }
    
    console.log(`PDF 渲染完成, 共 ${canvases.length} 页`);
    return canvases;
  } catch (error) {
    console.error('渲染PDF失败:', error);
    throw new Error(`渲染PDF失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 将 PNG 图片加载到 Canvas，并可选地调整为指定宽度
 */
const loadPngToCanvas = async (file: File, targetWidth?: number): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      // 如果指定了目标宽度，则按比例调整尺寸
      if (targetWidth) {
        const aspectRatio = img.height / img.width;
        canvas.width = targetWidth;
        canvas.height = Math.round(targetWidth * aspectRatio);
        console.log(`调整PNG图片尺寸: 原始 ${img.width}x${img.height}, 调整后 ${canvas.width}x${canvas.height}`);
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建 canvas 上下文'));
        return;
      }
      
      // 绘制图片，保持宽高比
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };
    img.onerror = () => {
      reject(new Error('加载图片失败'));
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 创建长图像
 */
export async function createLongImage(
  mainFile: File, 
  tailFile: File | null = null, 
  progressCallback?: (progress: number) => void,
  pageLimit?: number
): Promise<string> {
  console.log('开始创建长图...');
  console.log(`主文件: ${mainFile.name}, 大小: ${(mainFile.size / 1024 / 1024).toFixed(2)}MB`);
  if (tailFile) {
    console.log(`尾部文件: ${tailFile.name}, 大小: ${(tailFile.size / 1024 / 1024).toFixed(2)}MB`);
  } else {
    console.log('没有尾部文件');
  }
  
  if (pageLimit) {
    console.log(`用户指定页数限制: ${pageLimit} 页`);
  }
  
  const fileSizeMB = mainFile.size / (1024 * 1024);
  
  // 检查文件大小
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    console.warn(`文件大小(${fileSizeMB.toFixed(2)}MB)超过 ${MAX_FILE_SIZE_MB}MB，可能只会处理前 ${pageLimit || MAX_PAGES} 页`);
  }
  
  try {
    // 加载主 PDF 文件
    console.log('加载主PDF文件...');
    const pdf = await loadPDF(mainFile);
    
    console.log('渲染主PDF文件...');
    let mainCanvases: HTMLCanvasElement[] = [];
    let tailCanvases: HTMLCanvasElement[] = [];
    let targetWidth = 0;
    
    // 如果有尾部图片，先加载它来确定目标宽度
    if (tailFile) {
      try {
        if (tailFile.type === 'image/png') {
          console.log('先加载尾部PNG图片以确定目标宽度...');
          const tailCanvas = await loadPngToCanvas(tailFile);
          console.log(`尾部图片原始尺寸: ${tailCanvas.width}x${tailCanvas.height}`);
          targetWidth = tailCanvas.width;
        }
      } catch (error) {
        console.error('处理尾部图片时出错:', error);
      }
    }
    
    // 渲染PDF，使用尾部图片宽度作为目标宽度，传递页数限制
    mainCanvases = await renderPDF(pdf, targetWidth, (progress) => {
      if (progressCallback) {
        const adjustedProgress = tailFile ? progress * 0.8 : progress;
        progressCallback(adjustedProgress);
      }
    }, pageLimit);
    
    // 计算PDF页面的最大宽度
    let pdfMaxWidth = 0;
    for (const canvas of mainCanvases) {
      pdfMaxWidth = Math.max(pdfMaxWidth, canvas.width);
    }
    console.log(`PDF最大宽度: ${pdfMaxWidth}px`);
    
    // 如果有尾部图片，确保它与PDF宽度对齐
    if (tailFile) {
      try {
        if (tailFile.type === 'image/png') {
          console.log('调整尾部PNG图片以匹配PDF宽度...');
          const tailCanvas = await loadPngToCanvas(tailFile, pdfMaxWidth);
          console.log(`添加尾部PNG图片，调整后尺寸: ${tailCanvas.width}x${tailCanvas.height}`);
          tailCanvases.push(tailCanvas);
        } else {
          console.log('非PNG格式的尾部图片，将被忽略');
        }
      } catch (error) {
        console.error('处理尾部图片时出错:', error);
      }
    }
    
    // 合并主PDF和尾部图片的canvas列表
    const canvases = [...mainCanvases, ...tailCanvases];
    console.log(`总页数: ${mainCanvases.length} 页PDF + ${tailCanvases.length} 页尾部内容 = ${canvases.length} 页`);
    
    // 创建最终长图
    console.log('开始创建最终长图...');
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('无法创建最终 canvas 上下文');
    }
    
    // 计算总高度和最大宽度
    let totalHeight = 0;
    let maxWidth = 0;
    
    for (const canvas of canvases) {
      totalHeight += canvas.height;
      maxWidth = Math.max(maxWidth, canvas.width);
    }
    
    console.log(`长图尺寸计算完成: 宽度 ${maxWidth}px, 高度 ${totalHeight}px`);
    
    // 设置最终 canvas 尺寸
    finalCanvas.width = maxWidth;
    finalCanvas.height = totalHeight;
    
    console.log('开始绘制所有页面到最终长图...');
    
    // 将所有页面 canvas 绘制到最终 canvas
    let y = 0;
    for (let i = 0; i < canvases.length; i++) {
      const canvas = canvases[i];
      // 水平居中对齐
      const x = (maxWidth - canvas.width) / 2;
      
      console.log(`绘制页面 ${i + 1}/${canvases.length} 到位置 (${x}, ${y})`);
      ctx.drawImage(canvas, x, y);
      y += canvas.height;
    }
    
    console.log('长图创建完成，转换为数据URL...');
    
    // 返回数据 URL
    const dataUrl = finalCanvas.toDataURL('image/png');
    console.log(`数据URL生成完成，大小约: ${Math.round(dataUrl.length / 1024)}KB`);
    
    return dataUrl;
  } catch (error) {
    console.error('创建长图失败:', error);
    throw new Error(`创建长图失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 处理大文件压缩
 */
export async function compressPDF(file: File): Promise<File> {
  // 这是一个简化的函数，实际实现会更复杂
  // 通常需要服务器端支持或使用更专业的库
  
  console.log(`检查文件是否需要压缩: ${file.name}, 大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  
  // 这里仅做大小检查，实际项目中应实现真正的压缩功能
  const fileSizeMB = file.size / (1024 * 1024);
  
  if (fileSizeMB > 10) {
    console.warn(`文件大于10MB(${fileSizeMB.toFixed(2)}MB)，需要压缩`);
    // 在这里实现压缩逻辑
  }
  
  return file;
}
