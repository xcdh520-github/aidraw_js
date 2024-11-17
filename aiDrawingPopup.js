import { createElement } from 'react';
import { useState } from 'react';
import './Popup.css'; // 引入样式文件

const AiDrawingPopup = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://ai.cloudroo.top/draw/?t=${encodeURIComponent(prompt)}`);
      if (!response.ok) throw new Error('网络响应失败');
      const imageBuffer = await response.buffer();
      setImage(URL.createObjectURL(new Blob([imageBuffer])));
    } catch (error) {
      console.error('生成图片错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e) => {
    const popup = e.currentTarget.parentElement;
    const offsetX = e.clientX - popup.getBoundingClientRect().left;
    const offsetY = e.clientY - popup.getBoundingClientRect().top;

    const handleMouseMove = (moveEvent) => {
      popup.style.left = `${moveEvent.clientX - offsetX}px`;
      popup.style.top = `${moveEvent.clientY - offsetY}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="popup-container">
      <img src="TeenyiconsPaintbrushSolid.png" alt="绘图图标" onMouseDown={handleMouseDown} />
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="请输入绘图提示词..."
      />
      <button onClick={handleGenerateImage} disabled={loading}>
        {loading ? '生成中...' : '生成图片'}
      </button>
      {image && (
        <div>
          <img src={image} alt="预览绘图" />
          <p>© 2024 XC-AI绘图插件. 保留所有权利.</p>
        </div>
      )}
    </div>
  );
};

export default AiDrawingPopup; 