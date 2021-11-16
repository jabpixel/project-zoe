import React, { useCallback, useEffect, useState } from "react"
import XTreeData from "../../../components/tree/XTreeData"
import InfoMessage from "../../../components/messages/InfoMessage"
import Box from "@material-ui/core/Box"
import Loading from "../../../components/Loading"
import Grid from "@material-ui/core/Grid"
import Hidden from "@material-ui/core/Hidden"
import { localRoutes, remoteRoutes } from "../../../data/constants"
import { get, search } from "../../../utils/ajax"
import { useSelector } from "react-redux"
import { IState } from "../../../data/types"
import DataList, { IMobileRow } from "../../../components/DataList"
import {
	Button,
	Chip,
	createStyles,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	makeStyles,
	Theme,
	Typography,
} from "@material-ui/core"
import { XHeadCell } from "../../../components/table/XTableHead"
import XAvatar from "../../../components/XAvatar"
import EditDialog from "../../../components/EditDialog"
import XTable from "../../../components/table/XTable"

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: "100%",
			maxWidth: 360,
			backgroundColor: theme.palette.background.paper,
		},
		fab: {
			position: "absolute",
			bottom: theme.spacing(2),
			right: theme.spacing(2),
		},
	})
)

const headCells: XHeadCell[] = [
	{
		name: "activity",
		label: "ACTIVITY",
	},
	{
		name: "members",
		label: "MEMBER(S)",
		render: (members: string[]) =>
			members.map((it: any, i: any) => (
				<Chip
					color='primary'
					variant='outlined'
					key={i}
					style={{ margin: 5, marginLeft: 0, marginTop: 0 }}
					size='small'
					label={it["person"]}
				/>
			)),
	},
]
const MemberActivityList = () => {
	const classes = useStyles()
	const [createDialog, setCreateDialog] = useState(false)
	const [loading, setLoading] = useState<boolean>(true)
	const [data, setData] = useState<any[]>([])
	const user = useSelector((state: IState) => state.core.user)
	const [value, setValue] = useState<any>()

	const handleItemClick = (id: number) => {}
	const person = {
		contactId: user.contactId,
	}
	console.log(person, "person")

	useEffect(() => {
		setLoading(true)

		get(
			`${remoteRoutes.membersActivity}/?contactId=${user.contactId}`,
			(data) => {
				console.log(data)

				setData(data)
			},
			undefined,
			() => {
				setLoading(false)
			}
		)
	}, [createDialog])

	return (
		<Box>
			<Box p={1} className={classes.root}>
				<Divider />
			</Box>
			<Box>
				<Hidden smDown>
					<Box pt={1}>
						{loading ? (
							<Loading />
						) : (
							<XTable
								headCells={headCells}
								data={data}
								initialRowsPerPage={5}
								initialSortBy='name'
								handleSelection={handleItemClick}
							/>
						)}
					</Box>
				</Hidden>
			</Box>
		</Box>
	)
}

export default MemberActivityList
