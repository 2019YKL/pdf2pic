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
    
    if (pdf.numPages > MAX_PAGES) {
      console.warn(`PDF 页数(${pdf.numPages})超过限制(${MAX_PAGES}), 将只处理前 ${MAX_PAGES} 页`);
    }
    
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
  scale: number = 1.5
): Promise<HTMLCanvasElement> {
  console.log(`开始渲染页面 ${page.pageNumber}, 缩放比例: ${scale}`);
  
  try {
    const viewport = page.getViewport({ scale });
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
  progressCallback?: (progress: number) => void
): Promise<HTMLCanvasElement[]> {
  const numPages = Math.min(pdf.numPages, MAX_PAGES);
  console.log(`开始渲染PDF, 总页数: ${numPages}`);
  
  const canvases: HTMLCanvasElement[] = [];
  
  try {
    for (let i = 1; i <= numPages; i++) {
      console.log(`获取页面 ${i}/${numPages}...`);
      const page = await pdf.getPage(i);
      
      console.log(`渲染页面 ${i}/${numPages}...`);
      const canvas = await renderPage(page);
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
 * 创建长图像
 */
export async function createLongImage(
  mainFile: File, 
  tailFile: File | null = null, 
  progressCallback?: (progress: number) => void
): Promise<string> {
  console.log('开始创建长图...');
  console.log(`主文件: ${mainFile.name}, 大小: ${(mainFile.size / 1024 / 1024).toFixed(2)}MB`);
  if (tailFile) {
    console.log(`尾部文件: ${tailFile.name}, 大小: ${(tailFile.size / 1024 / 1024).toFixed(2)}MB`);
  } else {
    console.log('没有尾部文件');
  }
  
  const fileSizeMB = mainFile.size / (1024 * 1024);
  
  // 检查文件大小
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    console.warn(`文件大小(${fileSizeMB.toFixed(2)}MB)超过 ${MAX_FILE_SIZE_MB}MB，可能只会处理前 ${MAX_PAGES} 页`);
  }
  
  try {
    // 加载主 PDF 文件
    console.log('加载主PDF文件...');
    const pdf = await loadPDF(mainFile);
    
    console.log('渲染主PDF文件...');
    const canvases = await renderPDF(pdf, (progress) => {
      // 如果有尾部文件，主 PDF 处理占 80%
      if (progressCallback) {
        const adjustedProgress = tailFile ? progress * 0.8 : progress;
        console.log(`主文件渲染进度: ${Math.round(progress * 100)}%, 调整后进度: ${Math.round(adjustedProgress * 100)}%`);
        progressCallback(adjustedProgress);
      }
    });
    
    let tailCanvases: HTMLCanvasElement[] = [];
    
    // 如果有尾部 PDF，加载并渲染它
    if (tailFile) {
      console.log('加载尾部PDF文件...');
      const tailPdf = await loadPDF(tailFile);
      
      console.log('渲染尾部PDF文件...');
      tailCanvases = await renderPDF(tailPdf, (progress) => {
        // 尾部 PDF 处理占剩余 20%
        if (progressCallback) {
          const adjustedProgress = 0.8 + progress * 0.2;
          console.log(`尾部文件渲染进度: ${Math.round(progress * 100)}%, 调整后总进度: ${Math.round(adjustedProgress * 100)}%`);
          progressCallback(adjustedProgress);
        }
      });
      
      // 将尾部 canvas 添加到主 canvas 列表
      console.log(`添加 ${tailCanvases.length} 页尾部内容`);
      canvases.push(...tailCanvases);
    }
    
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
