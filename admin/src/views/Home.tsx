import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Podcast, { PodcastTypes } from "../components/Podcast";
import { FC } from "react";
import AppView from "../components/AppView";
import { getPodcastToVerify } from "../services/admin";
import { AxiosError } from "axios";

const Home: FC = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  const [podcasts, setPodcasts] = useState<PodcastTypes[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchDataAsync = async () => {
    setIsLoading(true);
    try {
      const fetchedData = await getPodcastToVerify();
      setPodcasts(fetchedData);
    } catch (error) {
      if (error instanceof AxiosError) console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDataAsync();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filteredPodcasts = podcasts?.filter((podcast) =>
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredPodcasts) setPodcasts(filteredPodcasts);
    if (searchQuery == "") {
      fetchDataAsync();
    }
  }, [searchQuery]);

  const handleApprove = (podcast: PodcastTypes) => {
    setPodcasts((prev) => prev!.filter((p) => p.id !== podcast.id));
  };

  const handleReject = (podcast: PodcastTypes) => {
    // Gọi API để từ chối podcast
    setPodcasts((prev) => prev!.filter((p) => p.id !== podcast.id));
  };
  return (
    <AppView>
      <div className="pb-10 px-10">
        <p className="text-lg font-bold pt-3 ">Phê duyệt Podcast</p>
        <div className="flex flex-col">
          <div className="flex flex-row mb-4">
            <div className="flex-1">
              <TextField
                label="Tìm kiếm..."
                variant="standard"
                className="w-full"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          {isLoading && <p>Loading...</p>}
          <TableContainer component={Paper}>
            <Table aria-label="simple table" bgcolor="#ededed">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tên Podcast</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Thể loại</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Người đăng</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Poster</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Nghe Podcast</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Duyệt/Từ chối</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {podcasts?.map((podcast) => (
                  <Podcast
                    searchQuery={searchQuery}
                    key={podcast.id}
                    podcast={podcast}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {podcasts?.length == 0 && <strong className="my-6 text-[#ffa835]">Tất cả Podcast đã được phê duyệt</strong>}
        </div>
      </div>
    </AppView>
  );
};

export default Home;
