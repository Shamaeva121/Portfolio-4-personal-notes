import "./NotesListView.css";
import { NoteView } from "../NoteView";
import { FC } from 'react';
import { Post } from "../../api/Post"

export interface NotesListViewProps {
  notesList: Post [];
}

export const NotesListView: FC<NotesListViewProps> = ({ notesList }) => {
  console.log("notesList:", notesList);
    return ( 
    <ul className="note-list-view"> 
      {notesList.map((note) => ( 
        <li key={note.id}>  {}
          <NoteView post={note} /> 
        </li>
      ))}
    </ul>
  );
};
