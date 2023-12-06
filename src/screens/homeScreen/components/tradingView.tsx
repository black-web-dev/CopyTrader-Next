import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { selectCurrentPair } from '@/services/pair';

let tvScriptLoadingPromise: Promise<void>;

export default function TradingViewWidget(): JSX.Element {
  const onLoadScriptRef = useRef<(() => void) | null>(null);

  const currentPair = useSelector(selectCurrentPair);

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve as any;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => {
      onLoadScriptRef.current = null;
    };

    function createWidget() {
      if (
        document.getElementById('tradingview_chart') &&
        'TradingView' in window
      ) {
        new window.TradingView.widget({
          autosize: false,
          width: '100%',
          height: '100%',
          symbol: currentPair.ticket,
          interval: 'D',
          timezone: 'exchange',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#16182e',
          save_image: false,
          enable_publishing: false,
          allow_symbol_change: true,
          backgroundColor: '#16182e',
          container_id: 'tradingview_chart',
          hide_top_toolbar: true,
          hide_side_toolbar: true,
          custom_css_url: './tradingview.css',
          overrides: {
            'paneProperties.background': '#bed111',
          },
        });
      }
    }
  }, [currentPair]);

  return (
    <div className='tradingview-widget-container'>
      <div id='tradingview_chart' className='min-h-[400px]' />
    </div>
  );
}
