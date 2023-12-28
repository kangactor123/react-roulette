import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

function App() {
  const [value, setValue] = useState("");
  const [colorList, setColorList] = useState<string[]>([]);
  const [list, setList] = useState<string[]>([]);
  const ref = useRef<HTMLCanvasElement | null>(null);

  const rotateRoullete = () => {
    if (ref && ref.current) {
      const ctx = ref.current.getContext("2d");

      if (ctx) {
        ctx.canvas.style.transform = `initial`;
        ctx.canvas.style.transition = `initial`;

        setTimeout(() => {
          const ran = Math.floor(Math.random() * list.length);

          const arc = 360 / list.length;
          const rotate = ran * arc + 3600 + arc * 3 - arc / 4;

          ctx.canvas.style.transform = `rotate(-${rotate}deg)`;
          ctx.canvas.style.transition = `2s`;

          setTimeout(() => {
            // const regExp = new RegExp("^조");
            // const winner = list.find(
            //   (li) => regExp.test(li) || li.includes("영빈")
            // );
            alert(`당첨자는 바로! ${list[ran]} 입니다!`);
          }, 2000);
        }, 1);
      }
    }
  };

  useEffect(() => {
    if (ref && ref.current) {
      const ctx = ref.current.getContext("2d");
      const [cw, ch] = [ref.current.width / 2, ref.current.height / 2]; //canvas width, canvas height;
      const arc = Math.PI / (list.length / 2);

      if (ctx) {
        list.forEach((li, idx) => {
          console.log(li);
          ctx.beginPath();
          if (colorList.length === 0) {
            const tempList: string[] = [];
            list.forEach(() => {
              const color = `rgb(${Math.floor(
                Math.random() * 256
              )},${Math.floor(Math.random() * 256)},${Math.floor(
                Math.random() * 256
              )})`;
              tempList.push(color);
            });
            setColorList(tempList);
          }
          ctx.fillStyle = colorList[idx % colorList.length];
          ctx.moveTo(cw, ch);
          ctx.arc(cw, ch, cw, arc * (idx - 1), arc * idx);
          ctx.fill();
          ctx.closePath();
        });

        ctx.fillStyle = "#fff";
        ctx.font = "18px Pretendard";
        ctx.textAlign = "center";

        list.forEach((li, idx) => {
          console.log(li);
          const angle = arc * idx + arc / 2;

          ctx.save();
          ctx.translate(
            cw + Math.cos(angle) * (cw - 50),
            ch + Math.sin(angle) * (ch - 50)
          );

          ctx.rotate(angle + Math.PI / 2);

          list[idx].split(" ").forEach((text, j) => {
            ctx.fillText(text, 0, 30 * j);
          });

          ctx.restore();
        });
      }
    }
  }, [colorList, list]);

  return (
    <Wrapper>
      <div className="input-wrap">
        <div>참여자를 한명씩 입력해주세요.</div>
        <div>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
          <AddButton
            onClick={() => {
              if (value === "") return;
              setList((prev) => [...prev, value]);
              setColorList((prev) => {
                const color = `rgb(${Math.floor(
                  Math.random() * 256
                )},${Math.floor(Math.random() * 256)},${Math.floor(
                  Math.random() * 256
                )})`;
                return [...prev, color];
              });
              setValue("");
            }}
          >
            추가하기
          </AddButton>
        </div>
      </div>
      <div>
        {list.length === 0 ? (
          "참가자가 없습니다!"
        ) : (
          <>
            참가자 리스트:
            {list.map((li, idx) => (
              <>
                <span>{li}</span>
                {idx !== list.length - 1 && ", "}
              </>
            ))}
          </>
        )}
      </div>
      {list.length === 0 ? (
        <div>참가자를 입력해주세요</div>
      ) : (
        <div className="canvas-wrap">
          <canvas ref={ref} width={300} height={300} />
        </div>
      )}
      <div>
        {list.length ? (
          <RotateButton
            onClick={() => {
              if (list.length === 0) alert("참여자가 없습니다!!");
              else rotateRoullete();
            }}
          >
            룰렛 돌리기!!
          </RotateButton>
        ) : null}
      </div>
    </Wrapper>
  );
}

export default App;

const Input = styled.input`
  width: 180px;
  height: 30px;
  padding: 6px 12px;
  border: none;
  border-bottom: 1px solid gray;
`;

const AddButton = styled.button`
  width: 90px;
  height: 36px;
  border-radius: 12px;
  background-color: #e6b9de;
  color: #4942e4;
  font-weight: 600;
  border: none;
  cursor: pointer;
`;

const RotateButton = styled.button`
  width: 180px;
  height: 50px;
  border-radius: 15px;
  border: 1px dashed beige;
  cursor: pointer;
  background-color: #dc8686;

  &:hover {
    background-color: blue;
    color: #fff;
  }
`;

const Wrapper = styled.div`
  max-width: 768px;
  min-width: 320px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 24px;
  background-color: #fff;

  & .input-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;

    & div:nth-child(2) {
      display: flex;
      gap: 6px;
      align-items: flex-end;
    }
  }

  & .canvas-wrap {
    width: 300px;
    height: 300px;
    margin: 60px;
  }
`;
