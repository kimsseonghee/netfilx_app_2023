import React, { useEffect } from 'react'

function useOnClickOutside(ref, handler) {
  return (
    useEffect(() => {
      console.log('ref->',ref); // ref.current는 div.modal

      const listener = (event) => {
        if(!ref.current || ref.current.contains(event.target)){
          // 모달창이 안 닫히는 경우
          return; // 함수 종료
        }
          // 모달창이 닫히는 경우 () => {setModalOpen(false)}
          handler(event);
      }

      document.addEventListener("mousedown",listener);
      document.addEventListener("touchstart",listener);
    },[ref, handler])
  )
}

export default useOnClickOutside