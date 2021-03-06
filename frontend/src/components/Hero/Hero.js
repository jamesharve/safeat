import React from 'react'
import {useSelector} from 'react-redux';

import styles from '../../assets/styles/Hero.module.css'

const Hero = (props) => {
    const restaurant = useSelector(state => state.restaurant.restaurant)

    return (
        <div className={styles.hero}>
            <div className={styles.hero__content}>
            
                
                <div className={styles.hero__items}>
                    <h1 className={styles.hero__title}>{restaurant.title}</h1>
                    <h3 className={styles.hero__description}>{restaurant.description}</h3>
                </div>

        </div>
            
        </div>
    )
}

export default Hero