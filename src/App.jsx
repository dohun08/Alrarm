import {useEffect, useRef, useState} from 'react'
import './App.css'
import {correct} from '../public/image/correct/correct.js'

function App() {
  const [hour, setHour] = useState("")
  const [minute, setMinute] = useState("")
    const [db, setDb] = useState([])
    const [complete , setComplete] = useState(false)
    const audioRef = useRef(null);
    const randomNumber = useRef(Math.floor(Math.random() * (101 - 38 + 1)) + 38);
    const [imgSrc, setImgSrc] = useState();
    const [answer, setAnswer] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');

    useEffect(() => {
        setDb(JSON.parse(localStorage.getItem('times')) || [])
    }, [complete]);
    console.log(randomNumber.current)

    function checkTimeAndPlayAlarm() {
        const now = new Date();
        db.forEach((item)=>{
            if (now.getHours() === Number(item.hour) && now.getMinutes() === Number(item.minute) ) {
                playAlarm();

                correct.map((item)=>{
                    if (item.id === randomNumber.current) {
                        if(item.answer === null){
                            setImgSrc(correct[item.id + 1].image)
                            setCorrectAnswer(correct[item.id + 1].answer)
                        }
                        setImgSrc(item.image)
                        setCorrectAnswer(item.answer)
                    }
                })
            }
        })
    }


    function playAlarm() {
        audioRef.current.play();
    }
    useEffect(() => {
        const interval = setInterval(checkTimeAndPlayAlarm, 30000);
        return () => clearInterval(interval);
    }, [db]);


  return (
      <>{ !correctAnswer ? (<>
          <h1>Math Timer</h1>
          <div className={"box"}>
              <label>시간</label>
              <input className={"input"} type={"number"} value={hour} onChange={e => setHour(e.target.value)}
                     placeholder={"시간을 입력해주세요"}/>
          </div>
          <div className={"box"}>
              <label>분</label>
              <input className={"input"} type={"number"} value={minute}
                     onChange={e => setMinute(e.target.value)} placeholder={"분을 입력해주세요 "}/>
          </div>
          <button onClick={() => {
              if (!hour || !minute || Number(hour) > 24 || Number(minute) > 60 || Number(hour) < 0 || Number(minute) < 0) {
                  alert("시간과 분을 입력해주세요")
                  return;
              }
              const newId = Date.now();
              localStorage.setItem('times', JSON.stringify([...db, { id: newId, hour, minute }]));
              setComplete(!complete)
          }}>추가
          </button>
          {db && db.map((item) => {
              return (
                  <div className={"card"} key={item.id}>
                      <p>{item.hour}시 {item.minute}분</p>
                      <button onClick={() => {
                          localStorage.setItem('times', JSON.stringify(db.filter(item2 => item2.id !== item.id)));
                          setComplete(!complete)
                      }}>삭제
                      </button>
                  </div>
              )
          })}
      </>
          )
          : <>
              <img src={imgSrc} alt={"랜덤이미지"}/>
              <br/>
              <input className={"input"} type={'text'} value={answer} onChange={(e) => setAnswer(e.target.value)}/>
              <button onClick={() => {
                  if (answer === String(correctAnswer)) {
                      audioRef.current.pause()
                      setAnswer('');
                      setCorrectAnswer('');
                      randomNumber.current = Math.floor(Math.random() * (101 - 38 + 1)) + 38;
                      alert("정답")
                  } else {
                      alert("틀렸습니다")
                  }
              }}>입력
              </button>
          </>}
          <audio style={{display: "none"}} ref={audioRef} src="/image/audio/BBBB.mp3" loop></audio>
      </>

  )
}

export default App
