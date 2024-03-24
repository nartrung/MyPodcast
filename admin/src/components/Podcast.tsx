import { TableCell, TableRow } from "@mui/material";
import { useMemo } from "react";
import ReactPlayer from "react-player";

export interface PodcastTypes {
  id: string;
  title: string;
  about: string;
  category: string;
  poster: string;
  owner: string;
  ownerId: string;
  file: string;
}

export interface Props {
  podcast: PodcastTypes;
  searchQuery: string;
  onApprove: (podcast: PodcastTypes) => void;
  onReject: (podcast: PodcastTypes) => void;
}

const Podcast: React.FC<Props> = ({ podcast, searchQuery, onApprove, onReject }) => {
  const { id, title, category, owner, poster } = podcast;
  useMemo(() => title.toLowerCase().includes(searchQuery.toLowerCase()), [title, searchQuery]);
  return (
    <TableRow key={id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        {id.slice(4, 10)}
      </TableCell>
      <TableCell align="left" width={200}>
        {title}
      </TableCell>
      <TableCell align="left">{category}</TableCell>
      <TableCell align="left" width={120}>
        {owner}
      </TableCell>
      <TableCell align="left">
        <img className="h-16 rounded-md border-[#ffa835] border-2" src={poster} />
      </TableCell>
      <TableCell align="left">
        <div>
          <ReactPlayer height={40} width={220} controls playing={false} url={podcast.file} />
        </div>
      </TableCell>
      <TableCell align="left">
        <div className="flex gap-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onClick={() => onApprove}>
            Duyệt
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={() => onReject}>
            Xóa
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default Podcast;
