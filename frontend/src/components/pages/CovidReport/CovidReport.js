import React, {useState} from 'react';
import DatePicker from 'react-datetime-picker';
import {useSelector} from 'react-redux'

import classes from '../../../assets/styles/CovidReport.module.css'
import OpenModal from '../../ui/OpenModal/OpenModal';
import {reportPositive} from '../../../services/covidReport/covidReport';
const CovidReport = (props) => {
    const [date, setDate] = useState(new Date);
    const [verifySubmit, setVerifySubmit] = useState(false);
    const [verifyConfirm, setVerifyConfirm] = useState(false);
    const restaurantName = useSelector(state => state.user.user?.name);

    const report = () => {
        if(date instanceof Date && !isNaN(date)) {
            reportPositive(date)
            setVerifySubmit(false)
            setVerifyConfirm(true)
        }
    }

    return (
        <div>
            <div className={classes.Body}>
                <h1>Report Employee Covid Exposure</h1>
                <h3>{restaurantName}</h3>
                <div>
                    <div>
                        <p className={classes.Text}>Positive covid test reports will go into the system and will immediately alert any customers who had placed orders with the restaurant for two weeks preceding the positive test.</p>
                    </div>
                    <div className={classes.Date}>
                        <p><b>Date of positive covid test:</b> </p>
                        <DatePicker
                            value={date}
                            onChange={data => setDate(data)}
                        />
                    </div>
                    <p>*Before you submit the report make sure that all details are correct as this is not reversible</p>
                    <button
                        className={classes.submit__button}
                        onClick={() => setVerifySubmit(true)}
                    >
                        Submit Report
                    </button>
                </div>
                <OpenModal
                    show={verifySubmit}
                    closeModal={() => setVerifySubmit(false)}
                >
                    <h1>Confirm Submit Covid Positive Test</h1>
                    <h3>On: {new Date(date).toDateString() + ' ' +new Date(date).toLocaleTimeString()}</h3>
                    <h3>At: {restaurantName}</h3>
                    <div>
                        <button className={classes.submit__button} onClick={report}>Confirm</button>
                        <button className={classes.cancel__button} onClick={() => setVerifySubmit(false)}>Cancel</button>
                    </div>
                </OpenModal>
                <OpenModal
                    show={verifyConfirm}
                    closeModal={() => setVerifyConfirm(false)}
                >
                    <h1>Report Has Been Confirmed</h1>
                    <div>
                        <button className={classes.submit__button} onClick={() => setVerifyConfirm(false)}>OK</button>
                    </div>
                </OpenModal>
            </div>
        </div>
    );
};

export default CovidReport;