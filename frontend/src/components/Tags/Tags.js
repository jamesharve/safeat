import React, {useState} from 'react';
import {KeyboardArrowLeftOutlined, KeyboardArrowRightOutlined} from '@material-ui/icons';

import {tags} from '../../data/Tags/Tags';
import classes from './Tags.module.css';
import Tag from "./Tag/Tag";

const Tags = (props) => {
    const [shift, setShift] = useState(0)

    const scrollLeft = () => {
        if(shift < 0) {
            setShift(shift + 300)
        }
    }

    const scrollRight = () => {
        if(shift > -1200) {
            setShift(shift - 300)
        }
    }

    var tagsToUse = props.tags ? props.tags : tags
    console.log("Tags to use is", tagsToUse);

    return (
        <div>
            <h2 className={classes.Title}>{props.title}</h2>
            <div className={classes.Tags}>
                <div  style={{marginLeft: shift + 'px'}} className={classes.TagsHolder}>
                    {tagsToUse.map((tag) => <div className={classes.Tag}>
                        <Tag
                            name={tag.name}
                            img={tag.img}
                            selectItem={props.selectItem}
                        />
                    </div>)}
                </div>
                <div className={classes.ScrollLeft} onClick={() => scrollLeft()}> <KeyboardArrowLeftOutlined/>  </div>
                <div className={classes.ScrollRight} onClick={() => scrollRight()}><KeyboardArrowRightOutlined/> </div>
            </div>
        </div>

    );
}

export default Tags;