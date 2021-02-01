import React, { Component } from 'react'
import axios from 'axios';
import { Line } from 'react-chartjs-2';

export default class Stats extends Component {
    constructor() {
        super();
        this.state = {
            country: [],
            allCountries: [],
            isLoading: false,
            selectedCountry: '',
            deaths: [],
            cases: [],
        }
    }


    async getCountryStats() {
        if (this.state.selectedCountry !== '') {
            const res = await axios.get('/' + this.state.selectedCountry)
            const data = res.data.data;
            this.setState({ country: data }, this.getStats);
        }
    }

    async getCountries() {
        const res = await axios.get("/getAllCountries");
        const data = res.data.data;
        const country = data.map((d, index) => ({
            "id": index,
            "country": d,
        }));
        this.setState({ allCountries: country, isLoading: false });
    };

    handleChange(e) {
        this.setState({ selectedCountry: e }, this.getCountryStats);
    }


    componentDidMount() {
        this.setState({ isLoading: true });
        this.getCountries();
    }

    getAllLabels() {
        let labels = [];
        for (let i = 0; i < this.state.country.length; i++) {
            if (!labels.includes(this.state.country[i].year_week)) {
                labels.push(this.state.country[i].year_week)
            }
        }
        return labels;
    };

    getStats() {
        let deaths = [];
        let cases = [];
        for (let i = 0; i < this.state.country.length; i++) {
            if (this.state.country[i].indicator === "deaths") {
                deaths.push(Math.abs(this.state.country[i].weekly_count));
            } else if (this.state.country[i].indicator === "cases") {
                cases.push(Math.abs(this.state.country[i].weekly_count));
            }
        }
        this.setState({ deaths: deaths, cases: cases })
    };

    renderChart() {
        if (this.state.selectedCountry !== '') {
            return (
                <Line
                    data={{
                        labels: this.getAllLabels(),
                        datasets: [
                            {
                                label: 'Deaths',
                                data: this.state.deaths,
                                backgroundColor: 'red',
                            },
                            {
                                label: 'Cases',
                                data: this.state.cases,
                                backgroundColor: 'blue',
                            }
                        ]
                    }}
                    options={{
                        title: {
                            display: true,
                            text: this.state.selectedCountry + ' COVID-19 Deaths and Cases by week chart'
                        },
                        layout: {
                            padding: {
                                left: 10,
                                right: 10,
                                top: 10,
                                bottom: 10,
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                }
                            }]
                        }
                    }} />
            )
        }
    }


    render() {
        if (this.state.isLoading) {
            return (
                <div> Loading... </div>
            )
        }
        return (
            <div>
                <form>
                    <label>Select the country:
                    <select value={this.state.selectedCountry}
                            onChange={(e) => this.handleChange(e.target.value)}>
                            {this.state.allCountries.map(country => (
                                <option key={country.country} value={country.country}>
                                    {country.country}
                                </option>
                            ))}
                        </select>
                    </label>
                </form>
                <div>
                    {this.renderChart()}
                </div>
            </div>


        )
    }
}
