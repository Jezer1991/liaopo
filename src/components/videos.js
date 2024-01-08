import React from "react";

import  {Grid, Card} from '@mui/material';
import * as conf from '../conf';

class Videos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            videos: []
        }
    }
    componentWillMount() {
        setTimeout(() => {
            fetch(`${conf.API}videos`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        videos: data.result
                    });
                })
        });
    }
    render() {
        return (
            <Grid style={{ width: "90%", margin: "0px auto", marginTop: "30px", marginBottom: "30px" }} container spacing={1} columnSpacing={{ xs: 1, sm: 3, md: 1, lg: 1 }}>
                {this.state.videos.map((video) => (
                    <div class="col-md-3" style={{margin: "10px"}}>
                        <Card sx={{ maxWidth: 350, minHeight:350 }}>
                        <iframe width="350" height="315" src={video.url}
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen>
                        </iframe>
                        </Card>
                    </div>
                ))}
            </Grid>
        );
    }
}
export default Videos;