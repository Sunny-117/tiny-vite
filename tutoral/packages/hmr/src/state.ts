import { clear } from "console";

let timer: NodeJS.Timeout | undefined;

if (import.meta.hot) { 
  //初始化count
  if (!import.meta.hot.data.count) { 
    import.meta.hot.data.count = 0;
  }

  import.meta.hot.dispose(() => { 
    if (timer) { 
      clearInterval(timer);
    }
  })
}

export function initState() { 
  const getCount = () => { 
    const data = import.meta.hot.data || { count: 0 };
    data.count = data.count + 1;
    return data.count;
  }

  timer = setInterval(() => {
    let countEle = document.querySelector<HTMLSpanElement>('#count');
    countEle.innerText = getCount() + '';
  },1000)
}