import React, { Component } from 'react'
import axios from 'axios'
import { SwipeAction, Card, WingBlank, WhiteSpace } from 'antd-mobile'
import Loading from './Loading'

export default class CoinCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            isLoading: true,
            modalEnable: true,
        }
    }
    handleShowModal = () => {
        if (this.state.modalEnable) {
            this.props.handleShowModal(this.props.symbol)
        }
    }
    removeFromList = (e) => {
        this.props.removeFromList(this.props.symbol)
    }
    componentDidMount() {
        axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${this.props.symbol}&tsyms=CNY`)
        .then(res => {
            if (res.data.Response === "Error") {
                this.setState({
                    data: {
                        "Error": true,
                        "PRICE": 1,
                        "OPENDAY": 1,
                        },
                    isLoading: false,
                 })
            } else {
                this.setState({
                    data: res.data.RAW[this.props.symbol].CNY,
                    isLoading: false,
                 })
            }
        })
    }
    render() {
        if (+this.props.possession === 0) {
            return false
        } else {
            if (!this.state.isLoading) {
                const changePercentage = (this.state.data.PRICE-this.state.data.OPENDAY)/this.state.data.OPENDAY
                return (
                    <WingBlank size="lg">
                        <SwipeAction
                            right={[
                                {
                                text: '删除',
                                onPress: this.removeFromList,
                                style: { backgroundColor: 'crimson', color: 'white' },
                                },
                            ]}
                            onOpen={() => this.setState({modalEnable: false})}
                            onClose={() => setTimeout(()=>this.setState({modalEnable: true}),500)}
                        >
                            <Card onClick={this.handleShowModal}>
                                <Card.Header
                                    title={this.props.coinName}
                                    thumb={`/icon/${this.props.ImageUrl}`}
                                    thumbStyle={{width:'2rem'}}
                                    extra={<span>{(this.props.possession ? (this.props.possession*this.state.data.PRICE).toFixed(2) : parseFloat(this.state.data.PRICE).toFixed(2))+' ¥'}</span>}
                                />
                                <Card.Body style={{minHeight:0}}>
                                    {this.state.data.Error && '未查询到相关信息'}
                                </Card.Body>
                                <Card.Footer
                                    content={this.props.possession ? `${this.props.possession} ${this.props.symbol}`: this.props.symbol} 
                                    extra={<div style={{
                                        color: changePercentage >= 0 ? 'forestgreen' : 'crimson'
                                    }}>{this.props.possession ? (this.props.possession*this.state.data.PRICE*changePercentage).toFixed(2)+' ¥' : (changePercentage*100).toFixed(2)+' %'}</div>}
                                />
                            </Card>
                        </SwipeAction>
                        <WhiteSpace size="xs" />
                    </WingBlank>
                )
            } else {
                return <Loading />
            }
        }
    }
}
