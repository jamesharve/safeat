import React from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux'

import classes from '../../../../assets/styles/OrderSummary.module.css';
import {setOrder} from '../../../../store/actions/orders';


const OrderSummary = (props) => {
    const dispatch = useDispatch();

    const goToOrder = () => {
        if(!props.pastOrder) {
            dispatch(setOrder(props.order))
        }
    }

    return (
        <div
            className={classes.Order}
            onClick={goToOrder}
        >
            <p><b>Order Id: </b>{props.order.id.slice(10,15)}</p>
            <p><b>Address: </b>{props.order.address}</p>
            <p><b>Order Items </b></p>
            {props.order.order.map((order) => <p key={order.menu_item}><b>{order.quantity}x </b>{order.menu_item}</p>)}
        </div>
    );
};

export default OrderSummary;