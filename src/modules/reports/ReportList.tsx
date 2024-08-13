import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {
  ListItem,
  List,
  ListItemText,
  TableBody,
  TableRow,
  TableCell,
  Table,
  TableHead,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  localRoutes,
  remoteRoutes,
  appPermissions,
} from '../../data/constants';
import { get } from '../../utils/ajax';
import Layout from '../../components/layout/Layout';
import { IReport } from './types';
import Loading from '../../components/Loading';
import { IState } from '../../data/types';
import Toast from '../../utils/Toast';
import XBreadCrumbs from '../../components/XBreadCrumbs';
import { hasAnyRole } from '../../data/appRoles';
import { useTableStyles } from '../../components/table/tableStyles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      marginBottom: theme.spacing(2),
    },
    reportList: {
      marginTop: theme.spacing(2),
    },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonContainer: {
      marginLeft: theme.spacing(2),
    },
  }),
);

const ReportListSubmit: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<IReport[]>([]);
  const classes = useStyles();
  const user = useSelector((state: IState) => state.core.user);
  const history = useHistory();
  const classesT = useTableStyles();

  useEffect(() => {
    const fetchReports = async () => {
      get(
        remoteRoutes.reports,
        (response: any) => {
          setReports(response);
        },
        (error: any) => {
          Toast.error('Failed to fetch reports');
          console.error('Failed to fetch reports', error);
        },
        () => setLoading(false),
      );
    };

    fetchReports();
  }, []);

  const handleSubmitReport = async (report: IReport) => {
    history.push(`${localRoutes.reports}/${report.id}/submit`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout title="Report Submission List">
      <Box className={classes.root}>
        <Box pb={2}>
          <XBreadCrumbs
            title="Reports"
            paths={[
              {
                path: localRoutes.home,
                label: 'Dashboard',
              },
            ]}
          />
        </Box>
        <Box mt={2} className={classes.reportList}>
          <Table
            className={classesT.table}
            aria-label="simple table"
            size="small"
          >
            <TableHead>
              <TableRow>
                <TableCell align="justify" component="th">
                  Report
                </TableCell>
                <TableCell align="center" component="th">
                  Report Type
                </TableCell>
                <TableCell align="center" component="th"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell align="justify">{report.name}</TableCell>
                  <TableCell align="center">
                    {report.viewType?.toLocaleUpperCase()}
                  </TableCell>
                  <TableCell align="center">
                    <div className={classes.buttonContainer}>
                      {report.fields && report.fields.length && (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleSubmitReport(report)}
                        >
                          Submit Report
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Layout>
  );
};

export default ReportListSubmit;
