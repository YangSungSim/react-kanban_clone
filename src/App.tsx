import { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Wrapper2 = styled.div`
  display: block;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap:10px;
  width: 100%;
`;


const Trash = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 150px;
  height: 200px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;


const Form = styled.form`
  width: 100%;
  input {
      width: 100%;
  }
`;


interface IForm {
  boardName: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit} = useForm<IForm>();

  const onValid = ({boardName}:IForm) => {
    setToDos(allBoards => {
      return {
        ...allBoards,
        [boardName]: []
      }
    })
    setValue("boardName","");
  }


  const onDragEnd = (info:DropResult) => {
    const {destination, draggableId, source} = info;
    if(!destination) return;
    if (destination?.droppableId === source.droppableId) {
      //same board movement
        setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy  //객체 안에서 키 값이 중복된 프로퍼티는 마지막에 선언된 프로퍼티를 사용
        };
        })
    }

    if(destination.droppableId !== source.droppableId) {
      //cross board movement
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return  {
          ...allBoards,
          [source.droppableId]:sourceBoard,
          [destination.droppableId]:destinationBoard,
        }
      })
    }
  }

  useEffect(() => {
    const data = localStorage.getItem("toDo");
    if (data) {
      setToDos(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("toDo", JSON.stringify(toDos));
    localStorage.setItem("number", "4");

  });

  return <DragDropContext onDragEnd={onDragEnd}>
    <Wrapper>
      <Wrapper2>
        <Title>새 보드 만들기</Title>
        <Form onSubmit={handleSubmit(onValid)}>
            <input {...register("boardName", {required: true})} type="text" placeholder={`Add task on new board`} />
        </Form>
        <Boards>
          {Object.keys(toDos).map(boardId => 
          <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          )}
        </Boards>
        <Trash> 🗑️ </Trash>
      </Wrapper2>
    </Wrapper>
  </DragDropContext>;
}

export default App;
function handleSubmit(onValid: any): import("react").FormEventHandler<HTMLFormElement> | undefined {
  throw new Error("Function not implemented.");
}

