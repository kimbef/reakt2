import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    const handleLinkHoverEvents = () => {
      document.querySelectorAll('a, button, [role="button"], input, select, textarea, .chakra-menu__menuitem, nav *, header *, [class*="nav"], [class*="menu"]')
        .forEach(el => {
          el.addEventListener('mouseenter', () => setLinkHovered(true));
          el.addEventListener('mouseleave', () => setLinkHovered(false));
        });
    };

    setTimeout(() => {
      addEventListeners();
      handleLinkHoverEvents();
    }, 100);

    window.addEventListener('resize', handleLinkHoverEvents);

    return () => {
      removeEventListeners();
      window.removeEventListener('resize', handleLinkHoverEvents);
    };
  }, []);

  useEffect(() => {
    const mutationCallback = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          document.querySelectorAll('a, button, [role="button"], input, select, textarea, .chakra-menu__menuitem, nav *, header *, [class*="nav"], [class*="menu"]')
            .forEach(el => {
              if (!(el as any).__cursorEventAttached) {
                el.addEventListener('mouseenter', () => setLinkHovered(true));
                el.addEventListener('mouseleave', () => setLinkHovered(false));
                (el as any).__cursorEventAttached = true;
              }
            });
        }
      }
    };

    const observer = new MutationObserver(mutationCallback);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.classList.add('custom-cursor');
    }
    
    return () => {
      if (body) {
        body.classList.remove('custom-cursor');
      }
    };
  }, []);

  const cursorDotStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    opacity: hidden ? 0 : 1,
    transform: `translate(-50%, -50%) scale(${clicked ? 0.5 : 1})`,
    backgroundColor: clicked ? 'rgba(255, 255, 255, 0.7)' : 'white',
  };

  const cursorOutlineStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    opacity: hidden ? 0 : 1,
    transform: `translate(-50%, -50%) scale(${clicked ? 1.2 : linkHovered ? 1.5 : 1})`,
    backgroundColor: linkHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    borderColor: linkHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)',
    mixBlendMode: 'difference',
  };

  return (
    <>
      <div className="cursor-dot" style={cursorDotStyle} />
      <div className="cursor-outline" style={{
        ...cursorOutlineStyle,
        mixBlendMode: 'difference' as const
      }} />
    </>
  );
};

export default CustomCursor; 