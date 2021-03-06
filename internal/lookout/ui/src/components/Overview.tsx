import React from 'react'
import {
  Container,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import MoreVert from "@material-ui/icons/MoreVert"
import RefreshIcon from "@material-ui/icons/Refresh"

import { QueueInfo } from "../services/JobService";
import { ModalState } from "../containers/OverviewContainer";
import JobDetailModal from "./JobDetailModal";

import './Overview.css'

interface OverviewProps {
  queueInfos: QueueInfo[]
  modalState: ModalState
  modalQueue: string
  openQueueMenu: string
  queueMenuAnchor: HTMLElement | null
  onRefresh: () => void
  onSetModalState: (modalState: ModalState, modalQueue: string) => void
  onSetQueueMenu: (queue: string, anchor: HTMLElement | null) => void
  onQueueMenuJobSetsClick: (queue: string) => void
  onQueueMenuJobsClick: (queue: string) => void
}

export default function Overview(props: OverviewProps) {
  const modal = getModal(props)

  return (
    <Container className="overview">
      {modal}
      <TableContainer component={Paper}>
        <div className="overview-header">
          <h2 className="title">Overview</h2>
          <div className="refresh-button">
            <IconButton
              title={"Refresh"}
              onClick={props.onRefresh}
              color={"primary"}>
              <RefreshIcon/>
            </IconButton>
          </div>
        </div>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Queue</TableCell>
              <TableCell align="right">Queued</TableCell>
              <TableCell align="right">Pending</TableCell>
              <TableCell align="right">Running</TableCell>
              <TableCell align="center">Oldest Queued Job</TableCell>
              <TableCell align="center">Longest Running Job</TableCell>
              <TableCell className="details-button-cell"/>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.queueInfos.map(q =>
              <TableRow key={q.queue}>
                <TableCell component="th" scope="row">
                  {q.queue}
                </TableCell>
                <TableCell align="right">{q.jobsQueued}</TableCell>
                <TableCell align="right">{q.jobsPending}</TableCell>
                <TableCell align="right">{q.jobsRunning}</TableCell>
                <TableCell align="center" className="duration-cell">
                  <div
                    className={q.oldestQueuedJob ? "link" : ""}
                    onClick={q.oldestQueuedJob ?
                      () => props.onSetModalState("OldestQueued", q.queue) :
                      () => {}}>
                    {q.oldestQueuedDuration}
                  </div>
                </TableCell>
                <TableCell align="center" className="duration-cell">
                  <div
                    className={q.longestRunningJob ? "link" : ""}
                    onClick={q.longestRunningJob ?
                      () => props.onSetModalState("LongestRunning", q.queue) :
                      () => {}}>
                    {q.longestRunningDuration}
                  </div>
                </TableCell>
                <TableCell align="center" className="details-button-cell" padding="none">
                  <IconButton
                    title={"View in Jobs table"}
                    size="small"
                    onClick={(event) => {
                      props.onSetQueueMenu(q.queue, event.currentTarget)
                    }}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={props.queueMenuAnchor}
                    open={q.queue === props.openQueueMenu}
                    onClose={() => props.onSetQueueMenu("", null)}>
                    <MenuItem onClick={() => props.onQueueMenuJobSetsClick(q.queue)}>Job Sets</MenuItem>
                    <MenuItem onClick={() => props.onQueueMenuJobsClick(q.queue)}>Jobs</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

function getModal(props: OverviewProps) {
  const queueInfoForModal = props.queueInfos.find(queueInfo => queueInfo.queue === props.modalQueue)

  if (queueInfoForModal && queueInfoForModal.oldestQueuedJob && props.modalState === "OldestQueued") {
    return (
      <JobDetailModal
        title={"Oldest Queued Job"}
        job={queueInfoForModal.oldestQueuedJob}
        isOpen={true}
        onClose={() => props.onSetModalState("None", "")}/>
    )
  }

  if (queueInfoForModal && queueInfoForModal.longestRunningJob && props.modalState === "LongestRunning") {
    return (
      <JobDetailModal
        title={"Longest Running Job"}
        job={queueInfoForModal.longestRunningJob}
        isOpen={true}
        onClose={() => props.onSetModalState("None", "")}/>
    )
  }

  return <></>
}
