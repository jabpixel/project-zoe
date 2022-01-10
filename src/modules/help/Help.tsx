import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { get } from "../../utils/ajax";
import XBreadCrumbs from "../../components/XBreadCrumbs";
import { localRoutes } from "../../data/constants";
import Layout from "./../../components/layout/Layout";
import YouTube from "react-youtube";
import Grid from "@material-ui/core/Grid";
import { remoteRoutes } from "../../data/constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      padding: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(1),
      },
    },
    video: {
      width: "100%",
    },
  })
); 

interface IFile {
      id?: string;
      title?: string;
    }

const Help = () => {
  const classes = useStyles();

  const [file, setFile] = useState<IFile[]>([]);

  const getHelp = async () => {
    try {
    await get (`${remoteRoutes.help}`, 
    (data) => { let files: IFile[] = [];
    //console.log(files, 'help files');
    for (let i = 0; i < data.length; i++) {
      const doc = {
        id: data[i].url,
        title: data[i].title,
      };
      files.push(doc);
  } 
  setFile(files);
  console.log(files, 'help files');
  return new Promise((data) => setTimeout(data, 5000));
  },)
  return new Promise((data) => setTimeout(data, 5000));
  } catch (error) {
    console.log(error);
  }
}
  useEffect(() => {
    getHelp();
 }, 
 []);

  return (
    <Layout>
      <Box className={classes.root}>
        <Box pb={2}>
          <XBreadCrumbs
            title="Help Center"
            paths={[
              {
                path: localRoutes.home,
                label: "Dashboard",
              },
            ]}
          />
        </Box>
        <Typography variant="h5">Tutorial Videos</Typography>
        <Box pt={2}>
          <Grid container spacing={4}>
            {file.map((it) => (
              <Grid item xs={12} md={6} key={it.id}>
                <YouTube videoId={it.id} id={it.id} className={classes.video} />
                <br />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default Help;
