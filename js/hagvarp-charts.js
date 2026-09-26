Highcharts.setOptions({
      lang: {
        decimalPoint: ",",
        thousandsSep: " ",
        shortWeekdays: ["Mán", "Týs", "Mik", "Hós", "Frí", "Ley", "Sun"],
        weekdays: ["Mánadagur", "Týsdagur", "Mikudagur", "Hósdagur", "Fríggjadagur", "Leygardagur", "Sunnudagur"],
        shortMonths: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
        months: ["Januar", "Februar", "Mars", "Apríl", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
        downloadJPEG: "Goym JPEG mynd",
        downloadPDF: "Goym PDF skjal",
        downloadPNG: "Goym PNG mynd",
        downloadSVG: "Goym SVG vektor mynd",
        loading: "lesi inn...",
        printChart: "Prenta",
        rangeSelectorFrom: "Frá",
        rangeSelectorTo: "Til",
        resetZoom: "Nullstilla zoom",
        resetZoomTitle: "Nullstilla zoom level 1:1"
      }
    });





//---------------------------------------------------------
//                                CHART 1
//---------------------------------------------------------
            var chart1;
            var chart1Data;
            var chart1_last_month;
            var chart1Timeout0;
            var chart1Timeout1;

            function startAnimatingChart1() {
                clearTimeout(chart1Timeout0);
                clearTimeout(chart1Timeout1);
                //1. Start by animating background

                //2. Animate in chart for this year
                chart1Timeout0 = setTimeout(function() {


                    drawChart1();
                }, 100);

                //3. Zoom to full
                chart1Timeout1 = setTimeout(function() {
                    chart1.update({xAxis: {
                        min: null,
                        max: null
                    }});
                }, 25000);
            }

            //Chart 1 specific functions
            function drawChart1() {
                var jsonStatData = chart1Data;
                //Extrat Data From JSON Stat
                ds = JSONstat(jsonStatData).Dataset(0);
                var months = ds.Dimension("month").id;
                            
                var folkatal = ds.Data({
                    "changes": "Popu_primo",
                    "village/city": "999999"
                }, false);
                
                var folkataldata = [];
                
                for (var i = 0; i < months.length; i++) {
                    var month = months[i].replace("M", "-");
                
                    folkataldata.push([
                        Date.parse(month + "-01"),
                        folkatal[i]
                    ]);
                }



                chart1_last_month = folkataldata[folkataldata.length - 1];
                chart1_last_month = chart1_last_month[0];


                // set up the updating of the chart each second
                len = folkataldata.length;

                //set marker on last point
                folkataldata[len - 1].push({
                    marker: {
                        enabled: true
                    }
                });


                //Build Series
                var createdSeries = [{
                    name: "Fólkatal",
                    data: folkataldata,
                    color: "#fff",
                    tooltip: {
                        valueDecimals: 0
                    }
                }
                ];

                //Build Title
                var title = ds.label;

                //Build subtitle
                var subtitle = ds.source;

                //Build Tooltip
                var tooltipFunction = function () {
                    var s = "<b>" + Highcharts.dateFormat("%Y-%b", this.x) + "</b>";
                    $.each(this.points,
                        function (i, point) {
                            s += "<br/>" + point.series.name + ": " + Highcharts.numberFormat(point.y, 0.0, ",", ".");
                        });

                    return s;
                }


                //Build Chart
                $("#chart1").highcharts({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: "line",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        borderWidth: 0,
                        renderTo: "container",
                        marginRight: 20,
                        events: {
                            load: function () {
                                chart1 = this;
                            }

                        }
                    },
                    rangeSelector: {
                        enabled: false
                    },

                    exporting: {
                        enabled: false
                    },

                    navigator: {
                        enabled: false
                    },
                    title: {
                        text: ""
                    },
                    legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "top",

                        itemStyle: {
                            color: "#fff",
                            fontWeight: "normal"
                        }
                    },
                    xAxis: {
                        title: {
                            enabled: false
                        },                        min: chart1_last_month - 65743595833,
                        max: chart1_last_month,
                        type: "datetime",
                        labels: {
                            style: {
                                color: "#fff",
                                fontSize: "11px"
                            },
                        }
                    },
                    yAxis: {
                        title: {
                            text: "",
                            style: {
                                color: "#fff",
                                fontWeight: "normal",
                                fontSize: "12px"
                            }
                        },
                        lineColor: "rgba(255,255,255,.16)",
                        tickColor: "rgba(255,255,255,.16)",
                        labels: {
                            formatter: function () {
                                return Highcharts.numberFormat(this.value, 0);
                            },
                            style: {
                                color: "#fff",
                                fontSize: "11px"
                            }
                        },
                    },
                    legend: {
                        enabled: false
                    },


                    tooltip: {
						enabled: false
                    },
                    plotOptions: {
                        line: {
                            marker: {
                                enabled: false,
                            },
                            dataLabels: {
                                enabled: true,
                                color: "#FFF",
                                useHTML: true,
                                crop: false,
                                overflow: false,
                                formatter: function() {
                                  var last  = this.series.data[this.series.data.length - 1];
                                  if (this.point.category === last.category  && this.point.y === last.y) {

                                    return ('<div class="MyDataLabelTooltip"><span class="datetext">' +  Highcharts.dateFormat("%e. %b &apos;%y",this.point.x + 43200000) + "</span><br />" +  Highcharts.numberFormat(this.point.y,0)  + "</div>");
                                  }
                                  else {return};
                                }
                            }
                        },
                        series: {
                            showInNavigator: true,
                        }
                    },
                    series: createdSeries
                });
            }

            var loadDataAndBuildChart1 = function() {
                POST("https://statbank.hagstova.fo/api/v1/fo/H2/IB/IB01/fo_vit_md_t.px", {
                    "query": [
                        {
                            "code": "village/city",
                            "selection": {
                                "filter": "item",
                                "values": [
                                    "999999"
                                ]
                            }
                        },
                        {
                            "code": "changes",
                            "selection": {
                                "filter": "item",
                                "values": [
                                    "Popu_primo", "Popu_ultimo"
                                ]
                            }
                        }
                    ],
                    "response": {
                        "format": "json-stat"

                    }
                }, function(rawData) {
                    chart1Data = rawData;
                    drawChart1();
                } );
            }






//---------------------------------------------------------
//                                CHART 2
//---------------------------------------------------------
            var chart2;
            var chart2Data;
            var chart2CreatedSeries;
            var chart2_last_month;
            var chart2Timeout0;
            var chart2Timeout1;
            var chart2Timeout2;
            var chart2Timeout3;

            function startAnimatingChart2() {
                clearTimeout(chart2Timeout0);
                clearTimeout(chart2Timeout1);
                clearTimeout(chart2Timeout2);
                clearTimeout(chart2Timeout3);

                drawChart2();

                chart2Timeout0 = setTimeout(function() {
                    chart2.addSeries(chart2CreatedSeries[0]);
                }, 0);
                chart2Timeout1 = setTimeout(function() {
                    chart2.addSeries(chart2CreatedSeries[1]);
                }, 2000);
                chart2Timeout2 = setTimeout(function() {
                    chart2.addSeries(chart2CreatedSeries[2]);
                }, 4000);

                chart2Timeout3 = setTimeout(function () {



					var d = new Date();
					var n = d.getFullYear();

                	chart2.series[2].update({
				        zoneAxis: 'x',
				        zones: [{
				            value: Date.parse(n-1),
				            color: '#ffffff'
				        },{
				            color: 'rgba(255,255,255,0)'
				        }]                		                		

                	});             	

					chart2.update({
                    	xAxis: {
	                        min: null,
	                        max: Date.parse(n)-86400000,
                        }
                    });


                }, 25000);

            }

            //Chart 2 specific functions
            function drawChart2() {
            
                var jsonStatData = chart2Data;
                // Extract data from JSON-stat
                var ds = JSONstat(jsonStatData).Dataset(0);
            
                // Month now contains year + month, e.g. 2016M01
                var months = ds.Dimension("month").id;
                var fLen = months.length;
            
                // Format Data
                var tilflytingdata = [];
                var fraflytingdata = [];
                var nettoflytingdata = [];
            
                var yaxistilflyting = [];
                var yaxisfraflyting = [];
            
                var tilflyting = ds.Data({
                    "changes": "Immigr_int",
                    "village/city": "999999"
                }, false);
            
                var fraflyting = ds.Data({
                    "changes": "Emmigr_int",
                    "village/city": "999999"
                }, false);
            
                for (var i = 0; i < fLen; i++) {
                
                    // 2016M01 -> 2016-01-01
                    var month = months[i].replace("M", "-") + "-01";
                    var date = Date.parse(month);
                
                    yaxistilflyting.push(tilflyting[i]);
                    yaxisfraflyting.push(-fraflyting[i]);
                
                    tilflytingdata.push([
                        date,
                        tilflyting[i]
                    ]);
                
                    fraflytingdata.push([
                        date,
                        -fraflyting[i]
                    ]);
                
                    nettoflytingdata.push([
                        date,
                        tilflyting[i] - fraflyting[i]
                    ]);
                }
            
                var chart2_last_month =
                    tilflytingdata[tilflytingdata.length - 1][0];
            
                            //Build Series
                var createdSeries = [{
                    name: "Tilflyting",
                    data: tilflytingdata,
                    color: "#58D6B5",
                    borderWidth: 0,
                    tooltip: {
                        valueDecimals: 0
                    }
                }, {
                    name: "Fráflyting",
                    data: fraflytingdata,
                    color: "#FF7A79",
                    borderWidth: 0,
                    tooltip: {
                        valueDecimals: 0
                    }
                }, {
                    name: "Nettoflyting",
                    type: "spline",
                    data: nettoflytingdata,
                    color: "#fff",
                    borderWidth: 0,
                    tooltip: {
                        valueDecimals: 0
                    },
                    marker: {
                        enabled: false
                    }
                }];
                chart2CreatedSeries = createdSeries;


                //Build Title
                var title = ds.label;

                //Build subtitle
                var subtitle = ds.source;

                //Build Tooltip
                var tooltipFunction = function () {
                    var s = "<b>" + Highcharts.dateFormat("%Y-%b", this.x) + "</b>";
                    $.each(this.points,
                        function (i, point) {
                            s += "<br/>" + point.series.name + ": " + Highcharts.numberFormat(point.y, 0.0, ",", ".");
                        });
                        return s;
                    }

                //Build Chart
                $("#chart2").highcharts({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: "column",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        borderWidth: 0,
                        renderTo: "container",
                        events: {
                            load: function () {
                                chart2 = this;
                            }

                        }
                    },
                    rangeSelector: {
                        enabled: false
                    },

                    exporting: {
                        enabled: false
                    },

                    navigator: {
                        enabled: false
                    },
                    title: {
                        text: ""
                    },
                    legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "top",

                        itemStyle: {
                            color: "#fff",
                            fontWeight: "normal"
                        }
                    },
                    xAxis: {
                        title: {
                            enabled: false
                        },
                        type: "datetime",
                        min: chart2_last_month - 65743595833,
                        max: chart2_last_month,
                        labels: {
                            style: {
                                color: "#fff",
                                fontSize: "11px"
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: "",
                            style: {
                                color: "#fff",
                                fontWeight: "normal",
                                fontSize: "12px"
                            }
                        },
                        lineColor: "rgba(255,255,255,.16)",
                        tickColor: "rgba(255,255,255,.16)",
                        labels: {
                            formatter: function () {
                                return Highcharts.numberFormat(Math.abs(this.value),0);
                            },
                            style: {
                                color: "#fff",
                                font: "11px"
                            }
                        },
                    },
                    tooltip: {
						enabled: false
                    },
                    plotOptions: {
                        series: {
                            stacking: "normal",
                            showInNavigator: true,
                            dataGrouping:{
                                enabled: true,
                                approximation: "sum",
                                units:[ ["year", null]]
                            }
                        }
                    },
                    series: []
                });
            }

            function loadDataAndBuildChart2() {
                POST("https://statbank.hagstova.fo/api/v1/fo/H2/IB/IB01/fo_vit_md_t.px", {
                    "query": [
                        {
                            "code": "village/city",
                            "selection": {
                                "filter": "item",
                                "values": [
                                    "999999"
                                ]
                            }
                        },
                        {
                            "code": "changes",
                            "selection": {
                                "filter": "item",
                                "values": [
                                    "Emmigr_int", "Immigr_int"
                                ]
                            }
                        }
                    ],
                    "response": {
                        "format": "json-stat"

                    }
                },function(data) {
                    chart2Data = data;
                    drawChart2();
                    startAnimatingChart2();
                } );
            }





//---------------------------------------------------------
//                                CHART 3
//---------------------------------------------------------
            var chart3;
            var chart3Data;
            var chart3CreatedSeries;
            var chart3_last_month;
            var chart3Timeout0;
            var chart3Timeout1;
            var chart3Timeout2;
            var chart3Timeout3;

            function startAnimatingChart3() {
                clearTimeout(chart3Timeout0);
                clearTimeout(chart3Timeout1);
                clearTimeout(chart3Timeout2);
                clearTimeout(chart3Timeout3);

                drawChart3();

                chart3Timeout0 = setTimeout(function() {
                    chart3.addSeries(chart3CreatedSeries[0]);
                }, 0);
                chart3Timeout1 = setTimeout(function() {
                    chart3.addSeries(chart3CreatedSeries[1]);
                }, 2000);
                chart3Timeout2 = setTimeout(function() {
                    chart3.addSeries(chart3CreatedSeries[2]);
                }, 4000);

                chart3Timeout3 =setTimeout(function () {
					
					var d = new Date();
					var n = d.getFullYear();

                	chart3.series[2].update({
				        zoneAxis: 'x',
				        zones: [{
				            value: Date.parse(n-1),
				            color: 'rgba(255,255,255,1)'
				        },{
				            color: 'rgba(255,255,255,0)'
				        }]                		                		

                	}); 

               	


					chart3.update({
                    	xAxis: {
	                        min: null,
	                        max: Date.parse(n)-86400000,
                        }
                    });
                }, 25000);
            }

            //Chart 3 specific functions
            function drawChart3() {

                var jsonStatData = chart3Data;
                // Extract data from JSON-stat
    var ds = JSONstat(jsonStatData).Dataset(0);

    // Month now contains year + month, e.g. 2016M01
    var months = ds.Dimension("month").id;

    // Format Data
    var tilflytingdata = [];
    var fraflytingdata = [];
    var nettoflytingdata = [];

    var tilflyting = ds.Data({
        "changes": "Birth",
        "village/city": "999999"
    }, false);

    var fraflyting = ds.Data({
        "changes": "Death",
        "village/city": "999999"
    }, false);

    for (var i = 0; i < months.length; i++) {

        // 2016M01 -> 2016-01-01
        var month = months[i].replace("M", "-") + "-01";
        var date = Date.parse(month);

        tilflytingdata.push([
            date,
            tilflyting[i]
        ]);

        fraflytingdata.push([
            date,
            -fraflyting[i]
        ]);

        nettoflytingdata.push([
            date,
            tilflyting[i] - fraflyting[i]
        ]);
    }

    // Last available month
    var chart3_last_month =
        tilflytingdata[tilflytingdata.length - 1][0];

    // Build Series
    var createdSeries = [{
        name: "Fødd",
        data: tilflytingdata,
        color: "#58D6B5",
        borderWidth: 0,
        tooltip: {
            valueDecimals: 0
        }
    }, {
        name: "Deyð",
        data: fraflytingdata,
        color: "#FF7A79",
        borderWidth: 0,
        tooltip: {
            valueDecimals: 0
        }
    }, {
        name: "Burðaravlop",
        type: "spline",
        data: nettoflytingdata,
        color: "#fff",
        borderWidth: 0,
        tooltip: {
            valueDecimals: 0
        },
        marker: {
            enabled: false
        }
    }];

    chart3CreatedSeries = createdSeries;

    // Build Title
    var title = ds.label;

    // Build subtitle
    var subtitle = ds.source;

    // Build Tooltip
    var tooltipFunction = function () {
        var s = "<b>" + Highcharts.dateFormat("%Y-%b", this.x) + "</b>";

        $.each(this.points, function (i, point) {
            s += "<br/>" +
                point.series.name +
                ": " +
                Highcharts.numberFormat(point.y, 0.0, ",", ".");
        });

        return s;
    };

    // Build Chart
    $("#chart3").highcharts({
        credits: {
            enabled: false
        },

        chart: {
            type: "column",
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderWidth: 0,
            renderTo: "container",

            events: {
                load: function () {
                    chart3 = this;
                }
            }
        },

        rangeSelector: {
            enabled: false
        },

        exporting: {
            enabled: false
        },

        navigator: {
            enabled: false
        },

        title: {
            text: ""
        },

        legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "top",

            itemStyle: {
                color: "#fff",
                fontWeight: "normal"
            }
        },

        xAxis: {
            title: {
                enabled: false
            },

            type: "datetime",

            min: chart3_last_month - 65743595833,
            max: chart3_last_month,

            labels: {
                style: {
                    color: "#fff",
                    fontSize: "11px"
                }
            }
        },

        yAxis: {
            title: {
                text: "",
                style: {
                    color: "#fff",
                    fontWeight: "normal",
                    fontSize: "12px"
                }
            },

            lineColor: "rgba(255,255,255,.16)",
            tickColor: "rgba(255,255,255,.16)",

            labels: {
                formatter: function () {
                    return Highcharts.numberFormat(
                        Math.abs(this.value),
                        0
                    );
                },

                style: {
                    color: "#fff",
                    font: "11px"
                }
            }
        },

        tooltip: {
            enabled: false
        },

        plotOptions: {
            series: {
                stacking: "normal",
                showInNavigator: true,

                dataGrouping: {
                    enabled: true,
                    approximation: "sum",
                    units: [
                        ["year", null]
                    ]
                }
            }
        },

        series: []
    });
            }

            function loadDataAndBuildChart3() {
                POST("https://statbank.hagstova.fo/api/v1/fo/H2/IB/IB01/fo_vit_md_t.px", {
                    "query": [
                        {
                            "code": "village/city",
                            "selection": {
                                "filter": "item",
                                "values": [
                                    "999999"
                                ]
                            }
                        },
                        {
                            "code": "changes",
                            "selection": {
                                "filter": "item",
                                "values": [
                                    "Birth", "Death"
                                ]
                            }
                        }
                    ],
                    "response": {
                        "format": "json-stat"

                    }
                },function(data) {
                    chart3Data = data;
                    drawChart3();
                    startAnimatingChart3();
                } );
            }



//---------------------------------------------------------
//                       CHART 4
//---------------------------------------------------------
var chart4;
            var chart4Data;
            var chart4_last_month;
            var chart4Timeout0;

            function startAnimatingChart4() {
                clearTimeout(chart4Timeout0);

                drawChart4();

                chart4Timeout0 = setTimeout(function () {
                    chart4.update({xAxis: {
                        min: null,
                        max: null
                    }});
                }, 25000);
            }

            //Chart 4 specific functions
            function drawChart4() {
                var jsonStatData = chart4Data;

                //Extrat Data From JSON Stat
                ds = JSONstat(jsonStatData).Dataset(0);
                              
                m = ds.Dimension("month").id;
                var fLen = m.length;


                //Format Data
                var unemploymentdata = [];


                for (var i = 0; i < fLen; i++) {
                    var unemployment = ds.Data({ "measure": "UNE_FE_PCT_LF", "month": ds.Dimension("month").id[i] }, false);

                    month = m[i].replace("M", "-");
                    unemploymentdata.push([Date.parse(month), unemployment]);

                }

                var chart4_last_month = unemploymentdata[unemploymentdata.length - 1];
                chart4_last_month = chart4_last_month[0];

                //Build Series
                var createdSeries = [{
                    name: "Arbeiðsloysi",
                    data: unemploymentdata,
                    color: "#fff",
                    tooltip: {
                        valueDecimals: 1
                    }
                }
                ];

                //Build Title
                var title = ds.label;

                //Build subtitle
                var subtitle = ds.source;

                //Build Tooltip
                var tooltipFunction = function () {
                    var s = "<b>" + Highcharts.dateFormat("%Y-%b", this.x) + "</b>";
                    $.each(this.points,
                        function (i, point) {
                            s += "<br/>" + point.series.name + ": " + Highcharts.numberFormat(point.y, 0.0, ",", ".");
                        });

                    return s;
                }

                //Build Chart
                $("#chart4").highcharts({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type:"line",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        borderWidth: 0,
                        renderTo: "container",
                        events: {
                            load: function () {
                                chart4 = this;
                            }
                        }
                    },
                    rangeSelector: {
                        enabled: false
                    },

                    exporting: {
                        enabled: false
                    },
                    navigator: {
                        enabled: false
                    },
                    title: {
                        text: ""
                    },
                    legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "top",
                        itemStyle: {
                            color: "#fff",
                            fontWeight: "normal"
                        }
                    },
                    xAxis: {
                        title: {
                            enabled: false
                        },                        type: "datetime",
                        lineColor: "rgba(255,255,255,.16)",
                        tickColor: "rgba(255,255,255,.16)",
                        min: chart4_last_month - 65743595833,
                        max: chart4_last_month,
                        labels: {
                            style: {
                                color: "#fff",
                                fontSize: "11px"
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: "",
                            style: {
                                color: "#fff",
                                fontWeight: "normal",
                                fontSize: "12px"
                            }
                        },
                        lineColor: "rgba(255,255,255,.16)",
                        tickColor: "rgba(255,255,255,.16)",
                        tickInterval: 0.5,
                        labels: {
                            formatter: function () {
                                return Highcharts.numberFormat(this.value, 1) + " %";
                            },
                            style: {
                                color: "#fff",
                                fontSize: "11px"
                            }
                        },
                    },
                    tooltip: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        line: {
                            marker: {
                                enabled: false
                            },
                            dataLabels: {
                                enabled: true,
                                color: "#FFF",
                                useHTML: true,
                                crop: false,
                                overflow: false,
                                formatter: function() {
                                  var last  = this.series.data[this.series.data.length - 1];
                                  if (this.point.category === last.category  && this.point.y === last.y) {
                                    return ('<div class="MyDataLabelTooltip"><span class="datetext">' +  Highcharts.dateFormat("%b &apos;%y",this.point.x) + "</span><br />" +  Highcharts.numberFormat(this.point.y,1) + "%" + "</div>");
                                  }
                                  else {return};
                                }
                            }
                        },
                        series: {
                            showInNavigator: true
                        }
                    },
                    series: createdSeries
                });
            }

            function loadDataAndBuildChart4() {
                POST("https://statbank.hagstova.fo:443/api/v1/fo/H2/AM/AMS/ARL/arl_pctkyn_t.px", {
                    "query": [
                        {
                            "code": "measure",
                            "selection": {
                                "filter": "item",
                                "values": [
                                    "UNE_FE_PCT_LF"
                                ]
                            }
                        }
                    ],
                    "response": {
                        "format": "json-stat"
                    }
                }, function(data) {
                    chart4Data = data;
                    drawChart4();
                    startAnimatingChart4();
                });
            }







//---------------------------------------------------------
//                                CHART 4b
//---------------------------------------------------------

var chart4b;
            var chart4bData;
            var chart4bCreatedSeries;
            var chart4b_last_month;
            var chart4bTimeout0;
            var chart4bTimeout1;
            var chart4bTimeout2;
            var chart4bTimeout3;



            //Chart 4b specific functions
            function drawChart4b() {

                var jsonStatData = chart4bData;


                //Extrat Data From JSON Stat

                ds = JSONstat(jsonStatData).Dataset(0);




              var Nordstreymoyar = (ds.Data({"measure": "UNE_FE_PCT_LF", "region":"4300"}, false));
              var Sudurstreymoyar = (ds.Data({"measure": "UNE_FE_PCT_LF", "region":"4700"}, false));
              var Suduroyar = (ds.Data({"measure": "UNE_FE_PCT_LF", "region":"4600"}, false));
              var Sandoyar = (ds.Data({"measure": "UNE_FE_PCT_LF", "region":"4500"}, false));
              var Vaga = (ds.Data({"measure": "UNE_FE_PCT_LF", "region":"4400"}, false));
              var Eysturoyar = (ds.Data({"measure": "UNE_FE_PCT_LF", "region":"4200"}, false));
              var Nordoya = (ds.Data({"measure": "UNE_FE_PCT_LF", "region":"4100"}, false));


          var data = [
                  ['Nordstreymoyar', Nordstreymoyar],
                  ['Sudurstreymoyar', Sudurstreymoyar],
                  ['Suduroyar', Suduroyar],
                  ['Sandoyar', Sandoyar],
                  ['Vaga', Vaga],
                  ['Eysturoyar', Eysturoyar],
                  ['Nordoya', Nordoya] 
              ];



              // Load the map as a normal relative static asset.
              // This is GitHub Pages-safe, including when Hagvarp is hosted
              // below a repository path such as /hagvarp/.
              $.getJSON('utm.regions.geo.json')
                .done(function (geojson) {

                  // Initiate the chart
                  $('#chart4b').highcharts('Map', {
                    title: {
                          text: ''
                      },
                    credits: {
                        enabled: false
                      },
                    chart: {
                        backgroundColor: "rgba(255, 255, 255, 0)",
                    },


                    exporting: {
                        enabled: false
                    },                              
                      legend: {
                        enabled: false,
                          title: {
                              text: "Arbeiðsfjøldin (%) í mun til fólkatalið"
                          }
                        },
                      colorAxis: {


                      },
                      tooltip: {
                              valueDecimals: 1,
                              valueSuffix: '%',

                      },
                    plotOptions: {
                        map: {
                            dataLabels: {
                                enabled: true,
                                format: '{point.value:.1f}%',
                                className: 'MyDataLabelTooltip',
                                style: { fontSize: '1.6em !important' }                                
                            }
                        }
                    },                                
                      series: [{
                          data: data,
                          mapData: geojson,
                          joinBy: ['label', 0],
                          keys: ['label', 'value'],
                          name: 'Sýsla',
                          states: {
                              hover: {
                                  color: '#BADA55'
                              }
                          }
                      }]
                     
                  });
                })
                .fail(function (jqxhr, textStatus, error) {
                  console.error('Hagvarp: could not load utm.regions.geo.json:', textStatus, error);
                  $('#chart4b').html('<div class="chart-error">Kortið kundi ikki lesast.</div>');
                });


            }

            function loadDataAndBuildChart4b() {
                POST("https://statbank.hagstova.fo/api/v1/fo/H2/AM/AMS/ARL/arl_aldkysy_t.px", {
					   "query": [
					    {
					      "code": "measure",
					      "selection": {
					        "filter": "item",
					        "values": [
					          "UNE_FE_PCT_LF"
					        ]
					      }
					    },
					    {
					      "code": "region",
					      "selection": {
					        "filter": "item",
					        "values": [
					          "4100",
					          "4200",
					          "4300",
					          "4700",
					          "4400",
					          "4500",
					          "4600"
					        ]
					      }
					    },
					    {
					      "code": "month",
					      "selection": {
						  "filter": "top",
                    	  "values": [
                      	  "1"
					        ]
					      }
					    }
					  ],
                    "response": {
                        "format": "json-stat"

                    }

                },function(data) {
                    chart4bData = data;
                    drawChart4b();
                } );
            }











//---------------------------------------------------------
//                                CHART 5
//---------------------------------------------------------
            var chart5;
            var chart5Data;
            var chart5CreatedSeries;
            var chart5_last_month;
            var chart5Timeout0;
            var chart5Timeout1;
            var chart5Timeout3;

            function startAnimatingChart5() {
                clearTimeout(chart5Timeout0);
                clearTimeout(chart5Timeout1);
                clearTimeout(chart5Timeout3);

                drawChart5();

                chart5Timeout0 = setTimeout(function() {
                    chart5.addSeries(chart5CreatedSeries[0]);
                }, 100);
                chart5Timeout1 = setTimeout(function() {
                    chart5.addSeries(chart5CreatedSeries[1]);
                }, 2000);

                chart5Timeout3 =setTimeout(function () {
                    chart5.update({xAxis: {
                        min: null,
                        max: null
                    }});
                }, 25000);
            }

            //Chart 5 specific functions
            function drawChart5() {

                var jsonStatData = chart5Data;
                //Extrat Data From JSON Stat
                ds = JSONstat(jsonStatData).Dataset(0);
                m = ds.Dimension("month").id;
                var fLen = m.length;




                //Format Data
                var starvsfolkdata = [];
                var trendurdata = [];
                var month;


                for (var i = 0; i < fLen; i++) {

                    var starvsfolk = ds.Data({"value mode": "OBSERVED", "month": ds.Dimension("month").id[i] }, false);
                    var trendur = ds.Data({"value mode": "SESONAL_ADDATIVE_M_TREND", "month": ds.Dimension("month").id[i] }, false);

                    month = m[i].replace("M", "-");
                    starvsfolkdata.push([Date.parse(month), starvsfolk]);
                    trendurdata.push([Date.parse(month), trendur]);

                }




        


                var chart5_last_month = starvsfolkdata[starvsfolkdata.length - 1];
                chart5_last_month = chart5_last_month[0];

                //Build Series
                var createdSeries = [{
                    name: "Starvsfólk",
                    data: starvsfolkdata,
                    color: "#58D6B5",
                    borderWidth: 0,
                    tooltip: {
                        valueDecimals: 0
                    }
                }, {
                    name: "Trendur",
                    type: "spline",
                    data: trendurdata,
                    color: "#fff",
                    borderWidth: 0,
                    tooltip: {
                        valueDecimals: 0
                    },
                    marker: {
                        enabled: false
                    }
                }];
                chart5CreatedSeries = createdSeries;


                //Build Title
                var title = ds.label;

                //Build subtitle
                var subtitle = ds.source;

                //Build Tooltip
                var tooltipFunction = function () {
                    var s = "<b>" + Highcharts.dateFormat("%Y-%b", this.x) + "</b>";
                    $.each(this.points,
                        function (i, point) {
                            s += "<br/>" + point.series.name + ": " + Highcharts.numberFormat(point.y, 0.0, ",", ".");
                        });

                    return s;
                }

                //Build Chart
                $("#chart5").highcharts({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: "column",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        borderWidth: 0,
                        renderTo: "container",
                        events: {
                            load: function () {
                                chart5 = this;
                            }

                        }
                    },
                    rangeSelector: {
                        enabled: false
                    },

                    exporting: {
                        enabled: false
                    },

                    navigator: {
                        enabled: false
                    },
                    title: {
                        text: ""
                    },
                    legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "top",

                        itemStyle: {
                            color: "#fff",
                            fontWeight: "normal"
                        }
                    },
                    xAxis: {
                        title: {
                            enabled: false
                        },
                        type: "datetime",
                        min: chart5_last_month - 65743595833,
                        max: chart5_last_month,
                        labels: {
                            style: {
                                color: "#fff",
                                fontSize: "11px"
                            }
                        },
                        showLastLabel: true,

                    },
                    yAxis: {
                        title: {
                            text: "",
                            style: {
                                color: "#fff",
                                fontWeight: "normal",
                                fontSize: "12px"
                            }
                        },
                        min: 17000,
                        lineColor: "rgba(255,255,255,.16)",
                        tickColor: "rgba(255,255,255,.16)",
                        labels: {
                            formatter: function () {
                                return Highcharts.numberFormat(this.value, 0);
                            },
                            style: {
                                color: "#fff",
                                font: "11px"
                            }
                        },
                    },
                    tooltip: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            stacking: "normal",
                            showInNavigator: true
                        },
                        column: {
                            dataLabels: {
                                enabled: true,
                                color: "#FFF",
                                useHTML: true,
                                crop: false,
                                overflow: false,
                                formatter: function() {
                                  var last  = this.series.data[this.series.data.length - 1];
                                  if (this.point.category === last.category  && this.point.y === last.y) {

                                    return ('<div class="MyDataLabelTooltip"><span class="datetext">' + Highcharts.dateFormat("%b &apos;%y",this.point.x) + "</span><br />" + Highcharts.numberFormat(this.point.y,0)  + "</div>");
                                  }
                                  else {return};
                                }
                            }
                        },

                    },
                    series: []
                });
            }

            function loadDataAndBuildChart5() {
                POST("https://statbank.hagstova.fo/api/v1/fo/H2/AM/AMS/STF/stf_hov_md.px", {
                    "query": [
                    {
                        "code": "measure",
                        "selection": {
                            "filter": "item",
                            "values": [
                            "MAINJOB"
                            ]
                        }
                        },
                        {
                        "code": "value mode",
                        "selection": {
                            "filter": "item",
                            "values": [
                            "OBSERVED",
                            "SESONAL_ADDATIVE_M_TREND"
                            ]
                        }
                    }

                    ],
                    "response": {
                        "format": "json-stat"

                    }
                },function(data) {
                    chart5Data = data;
                    drawChart5();
                    startAnimatingChart5();
                } );
            }







//---------------------------------------------------------
//                                CHART 6
//---------------------------------------------------------
            var chart6;
            var chart6Data;
            var chart6CreatedSeries;
            var chart6_last_month;
            var chart6Timeout0;
            var chart6Timeout1;
            var chart6Timeout3;

            function startAnimatingChart6() {
                clearTimeout(chart6Timeout0);
                clearTimeout(chart6Timeout1);
                clearTimeout(chart6Timeout3);

                drawChart6();

                chart6Timeout0 = setTimeout(function() {
                    chart6.addSeries(chart6CreatedSeries[0]);
                }, 100);
                chart6Timeout1 = setTimeout(function() {
                    chart6.addSeries(chart6CreatedSeries[1]);
                }, 2000);

                chart6Timeout3 =setTimeout(function () {
                    chart6.update({xAxis: {
                        min: null,
                        max: null
                    }});
                }, 25000);
            }

            //Chart 6 specific functions
            function drawChart6() {

                var jsonStatData = chart6Data;
                //Extrat Data From JSON Stat
                ds = JSONstat(jsonStatData).Dataset(0);
                m = ds.Dimension("month").id;
                var fLen = m.length;
                



                //Format Data
                var lonirdata = [];
                var trendurdata = [];
                var month;


                for (var i = 0; i < fLen; i++) {

                    var lonir = ds.Data({"value mode": "OBSERVED", "month": ds.Dimension("month").id[i] }, false);
                    var trendur = ds.Data({"value mode": "SESONAL_ADDATIVE_M_TREND", "month": ds.Dimension("month").id[i] }, false);

                    month = m[i].replace("M", "-");
                    lonirdata.push([Date.parse(month), lonir/1000000]);
                    trendurdata.push([Date.parse(month), trendur/1000000]);

                }







                var chart6_last_month = lonirdata[lonirdata.length - 1];
                chart6_last_month = chart6_last_month[0];

                //Build Series
                var createdSeries = [{
                    name: "Lønir",
                    data: lonirdata,
                    color: "#58D6B5",
                    borderWidth: 0,
                    tooltip: {
                        valueDecimals: 0
                    }
                }, {
                    name: "Trendur",
                    type: "spline",
                    data: trendurdata,
                    color: "#fff",
                    borderWidth: 0,
                    tooltip: {
                        valueDecimals: 0
                    },
                    marker: {
                        enabled: false
                    }
                }];
                chart6CreatedSeries = createdSeries;


                //Build Title
                var title = ds.label;

                //Build subtitle
                var subtitle = ds.source;

                //Build Tooltip
                var tooltipFunction = function () {
                    var s = "<b>" + Highcharts.dateFormat("%Y-%b", this.x) + "</b>";
                    $.each(this.points,
                        function (i, point) {
                            s += "<br/>" + point.series.name + ": " + Highcharts.numberFormat(point.y, 0.0, ",", ".");
                        });

                    return s;
                }

                //Build Chart
                $("#chart6").highcharts({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: "column",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        borderWidth: 0,
                        renderTo: "container",
                        events: {
                            load: function () {
                                chart6 = this;
                            }

                        }
                    },
                    rangeSelector: {
                        enabled: false
                    },

                    exporting: {
                        enabled: false
                    },

                    navigator: {
                        enabled: false
                    },
                    title: {
                        text: ""
                    },
                    legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "top",

                        itemStyle: {
                            color: "#fff",
                            fontWeight: "normal"
                        }
                    },
                    xAxis: {
                        title: {
                            enabled: false
                        },
                        type: "datetime",
                        min: chart6_last_month - 65743595833,
                        max: chart6_last_month,
                        labels: {
                            style: {
                                color: "#fff",
                                fontSize: "11px"
                            }
                        },
                        showLastLabel: true

                    },
                    yAxis: {
                        title: {
                            text: "",
                            style: {
                                color: "#fff",
                                fontWeight: "normal",
                                fontSize: "12px"
                            }
                        },
                        lineColor: "rgba(255,255,255,.16)",
                        tickColor: "rgba(255,255,255,.16)",
                        labels: {
                            formatter: function () {
                                return Highcharts.numberFormat(this.value, 0);
                            },
                            style: {
                                color: "#fff",
                                font: "11px"
                            }
                        },
                    },
                    tooltip: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            stacking: "normal",
                            showInNavigator: true,
                        },
                        column: {
                            dataLabels: {
                                enabled: true,
                                color: "#FFF",
                                useHTML: true,
                                crop: false,
                                overflow: false,
                                formatter: function() {
                                  var last  = this.series.data[this.series.data.length - 1];
                                  if (this.point.category === last.category  && this.point.y === last.y) {
                                    return ('<div class="MyDataLabelTooltip"><span class="datetext">' + Highcharts.dateFormat("%b &apos;%y",this.point.x) + "</span><br />" + Highcharts.numberFormat(this.point.y,0) + " mió.</div>");
                                  }
                                  else {return};
                                }
                            }
                        },
                    },
                    series: []
                });
            }

            function loadDataAndBuildChart6() {
                POST("https://statbank.hagstova.fo:443/api/v1/fo/H2/AM/LON/LON01/lon_ul_hov_md.px", {
                    "query": [
                    {
                        "code": "value mode",
                        "selection": {
                            "filter": "item",
                            "values": [
                            "OBSERVED",
                            "SESONAL_ADDATIVE_M_TREND"
                            ]
                        }
                    }
                    ],
                    "response": {
                        "format": "json-stat"

                    }
                },function(data) {
                    chart6Data = data;
                    drawChart6();
                    startAnimatingChart6();
                } );
            }



//---------------------------------------------------------
//                                CHART 7
//---------------------------------------------------------

            var chart7;
            var chart7Data;
            var chart7CreatedSeries;
            var chart7_last_month;
            var chart7Timeout0;
            var chart7Timeout1;
            var chart7Timeout2;
            var chart7Timeout3;

            function startAnimatingChart7() {
                clearTimeout(chart7Timeout0);
                clearTimeout(chart7Timeout1);
                clearTimeout(chart7Timeout2);
                clearTimeout(chart7Timeout3);

                drawChart7();

                chart7Timeout0 = setTimeout(function() {
                    chart7.addSeries(chart7CreatedSeries[0]);
                }, 0);
                chart7Timeout1 = setTimeout(function() {
                    chart7.addSeries(chart7CreatedSeries[1]);
                }, 2000);
                chart7Timeout2 = setTimeout(function() {
                    chart7.addSeries(chart7CreatedSeries[2]);
                }, 4000);

                chart7Timeout3 =setTimeout(function () {


					var d = new Date();
					var n = d.getFullYear();

                	chart7.series[2].update({
				        zoneAxis: 'x',
				        zones: [{
				            value: Date.parse(n-1),
				            color: '#ffffff'
				        },{
				            color: 'rgba(255,255,255,0)'
				        }]                		                		

                	});             	

					chart7.update({
                    	xAxis: {
	                        min: null,
	                        max: Date.parse(n)-86400000,
                        }
                    });

                }, 25000);
            }

            //Chart 7 specific functions
            function drawChart7() {

                var jsonStatData = chart7Data;

                //Extract Data From JSON Stat
                ds = JSONstat(jsonStatData).Dataset(0);

                m = ds.Dimension("month").id;

                var fLen = m.length;

                //Format Data
                var innflutningurdata = [];
                var utflutningurdata = [];
                var nettoflytingdata = [];

                var month;

                for (var i = 0; i < fLen; i++) {

                    innflutningur = ds.Data({ "flow": "P71", "month": ds.Dimension("month").id[i] }, false);
                    utflutningur = ds.Data({ "flow": "P61", "month": ds.Dimension("month").id[i] }, false);



                    month = m[i].replace("M", "-");

                    

                    innflutningurdata.push([Date.parse(month), -innflutningur/1000000]);
                    utflutningurdata.push([Date.parse(month), utflutningur/1000000]);
                    nettoflytingdata.push([Date.parse(month), (utflutningur - innflutningur)/1000000]);   


                }



                var chart7_last_month = innflutningurdata[innflutningurdata.length - 1];
                chart7_last_month = chart7_last_month[0];

                //Build Series
                var createdSeries = [{
                    name: "Útflutningur",
                    data: utflutningurdata,
                    color: "#58D6B5",
                    borderWidth: 0,
                    tooltip: {
                        valueDecimals: 0
                    }
                }, {
                    name: "Innflutningur",
                    data: innflutningurdata,
                    color: "#70D6FF",
                    borderWidth: 0,

                    tooltip: {
                        valueDecimals: 0
                    }
                }, {
                    name: "Handilsjavni",
                    type: "spline",
                    data: nettoflytingdata,
                    color: "#fff",
                    borderWidth: 0,
                    tooltip: {
                        valueDecimals: 0
                    },
                    marker: {
                        enabled: false
                    }
                }];
                chart7CreatedSeries = createdSeries;


                //Build Title
                var title = ds.label;

                //Build subtitle
                var subtitle = ds.source;

                //Build Tooltip
                var tooltipFunction = function () {
                    var s = "<b>" + Highcharts.dateFormat("%Y-%b", this.x) + "</b>";
                    $.each(this.points,
                        function (i, point) {
                            s += "<br/>" + point.series.name + ": " + Highcharts.numberFormat(point.y, 0.0, ",", ".");
                        });

                    return s;
                }

                //Build Chart
                $("#chart7").highcharts({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: "column",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        borderWidth: 0,
                        renderTo: "container",
                        events: {
                            load: function () {
                                chart7 = this;
                            }

                        }
                    },
                    rangeSelector: {
                        enabled: false
                    },

                    exporting: {
                        enabled: false
                    },

                    navigator: {
                        enabled: false
                    },
                    title: {
                        text: ""
                    },
                    legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "top",

                        itemStyle: {
                            color: "#fff",
                            fontWeight: "normal"
                        }
                    },
                    xAxis: {
                        title: {
                            enabled: false
                        },
                        type: "datetime",
                        min: chart7_last_month - 65743595833,
                        max: chart7_last_month,
                        labels: {
                            style: {
                                color: "#fff",
                                fontSize: "11px"
                            }
                        },

                    },
                    yAxis: {
                        title: {
                            text: "",
                            style: {
                                color: "#fff",
                                fontWeight: "normal",
                                fontSize: "12px"
                            }
                        },
                        lineColor: "rgba(255,255,255,.16)",
                        tickColor: "rgba(255,255,255,.16)",
                        labels: {
                            formatter: function () {
                                return Highcharts.numberFormat(Math.abs(this.value),0);
                            },
                            style: {
                                color: "#fff",
                                font: "11px"
                            }
                        },
                    },
                    tooltip: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            stacking: "normal",
                            showInNavigator: true,
                            dataGrouping:{
                                enabled: true,
                                approximation: "sum",
                                units:[ ["year", null]]
                            }
                        },

                        

                    },
                    series: []
                });
            }

            function loadDataAndBuildChart7() {
                POST("https://statbank.hagstova.fo:443/api/v1/fo/H2/UH/UH01/uh_bec_t.px", {
                    "query": [
                        {
                            "code": "flow",
                            "selection": {
                                "filter": "item",
                                "values": [
                                "P61",
                                "P71"
                                ]
                            }
                        },                    
                        {
                              "code": "measure",
                              "selection": {
                                "filter": "item",
                                "values": [
                                  "Value"
                                ]
                              }
                        },

                        {
                            "code": "month",
                            "selection": {
                                "filter": "all",
                                "values": [
                                    "*"
                                ]
                            }
                        }

                    ],
                    "response": {
                        "format": "json-stat"

                    }

                },function(data) {
                    chart7Data = data;
                    drawChart7();
                    startAnimatingChart7();
                } );
            }





//---------------------------------------------------------
//                                CHART 8
//---------------------------------------------------------

            var chart8;
            var chart8Data;
            var chart8CreatedSeries;
            var chart8_last_month;
            var chart8Timeout0;
            var chart8Timeout1;
            var chart8Timeout2;
            var chart8Timeout3;
            var chart8Timeout4;

            function startAnimatingChart8() {
                clearTimeout(chart8Timeout0);
                clearTimeout(chart8Timeout1);
                clearTimeout(chart8Timeout2);
                clearTimeout(chart8Timeout3);
                clearTimeout(chart8Timeout4);

                drawChart8();

                chart8Timeout0 = setTimeout(function() {
                    chart8.addSeries(chart8CreatedSeries[0]);
                }, 100);
                chart8Timeout1 = setTimeout(function() {
                    chart8.addSeries(chart8CreatedSeries[1]);
                }, 2000);
                chart8Timeout2 = setTimeout(function() {
                    chart8.addSeries(chart8CreatedSeries[2]);
                }, 4000);
                chart8Timeout3 = setTimeout(function() {
                    chart8.addSeries(chart8CreatedSeries[3]);
                }, 6000);

                chart8Timeout4 =setTimeout(function () {

					var d = new Date();
					var n = d.getFullYear();

					chart8.update({
                    	xAxis: {
	                        min: null,
	                        max: Date.parse(n)-86400000,
                        }
                    });

                }, 25000);
            }

            //Chart 8 specific functions
            function drawChart8() {

                var jsonStatData = chart8Data;

                //Extrat Data From JSON Stat
                ds = JSONstat(jsonStatData).Dataset(0);
                
                month = ds.Dimension("month").id;
                var fLen = month.length;
                m = ds.Dimension("month").id;


            //Format Data

                var onnurfiskaslogdata = [];
                var toskurhysaupsidata = [];
                var makrelursildsvartkjafturdata = [];
                var alifiskurdata = [];

                for (var i = 0; i < fLen; i++) {


                    

                    var total = ds.Data({"species (MCS)": "TOTAL","month": ds.Dimension("month").id[i] }, false); 
                    var nonfiskaslog = ds.Data({"species (MCS)": "NON","month": ds.Dimension("month").id[i] }, false); 
                    var toskur = ds.Data({"species (MCS)": "01300", "month": ds.Dimension("month").id[i] }, false);
                    var hysa = ds.Data({"species (MCS)": "01500", "month": ds.Dimension("month").id[i] }, false);
                    var upsi = ds.Data({"species (MCS)": "02100", "month": ds.Dimension("month").id[i] }, false);
                    var makrelur = ds.Data({"species (MCS)": "03800", "month": ds.Dimension("month").id[i] }, false);
                    var sild = ds.Data({"species (MCS)": "03600", "month": ds.Dimension("month").id[i] }, false);
                    var svartkjaftur = ds.Data({"species (MCS)": "01200", "month": ds.Dimension("month").id[i] }, false);
                    var laksur = ds.Data({"species (MCS)": "00900", "month": ds.Dimension("month").id[i] }, false);
                    var sil = ds.Data({"species (MCS)": "01000", "month": ds.Dimension("month").id[i] }, false);


                        month = m[i].replace("M", "-");
                        onnurfiskaslogdata.push([Date.parse(month), (total-nonfiskaslog-toskur-hysa-upsi-makrelur-sild-svartkjaftur-laksur-sil)/1000000]);
                        toskurhysaupsidata.push([Date.parse(month), (toskur + hysa + upsi)/1000000]);
                        alifiskurdata.push([Date.parse(month), (laksur + sil)/1000000]);
                        makrelursildsvartkjafturdata.push([Date.parse(month), (makrelur + sild + svartkjaftur)/1000000]);

                }


                var chart8_last_month = onnurfiskaslogdata[onnurfiskaslogdata.length - 1];
                chart8_last_month = chart8_last_month[0];

                //Build Series
                var createdSeries = [
                {
                    name: "Toskur, hýsa, upsi",
                    data: toskurhysaupsidata,
                    color: "#FF7A79",
                    tooltip: {
                        valueDecimals: 1
                    },
                    legendIndex:1,
                    index: 3
                },
                {
                    name: "Makrelur, sild, svartkjaftur",
                    data: makrelursildsvartkjafturdata,
                    color: "#FFD166",
                    tooltip: {
                        valueDecimals: 1
                    },
                    legendIndex:2,
                    index: 2
                },
                {
                    name: "Alifiskur",
                    data: alifiskurdata,
                    color: "#FF9A62",
                    tooltip: {
                        valueDecimals: 1
                    },
                    legendIndex:3,
                    index: 1
                },
                {
                    name: "Onnur fiskasløg",
                    data: onnurfiskaslogdata,
                    color: "#ecf0f1",
                    tooltip: {
                        valueDecimals: 1
                    },
                    legendIndex:4,
                    index: 0
                }
                ];
                chart8CreatedSeries = createdSeries;


                //Build Title
                var title = ds.label;

                //Build subtitle
                var subtitle = ds.source;

                //Build Tooltip
                var tooltipFunction = function () {
                    var s = "<b>" + Highcharts.dateFormat("%Y-%b", this.x) + "</b>";
                    $.each(this.points,
                        function (i, point) {
                            s += "<br/>" + point.series.name + ": " + Highcharts.numberFormat(point.y, 0.0, ",", ".");
                        });

                    return s;
                }

                //Build Chart
                $("#chart8").highcharts({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: "column",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        borderWidth: 0,
                        renderTo: "container",
                        events: {
                            load: function () {
                                chart8 = this;
                            }

                        }
                    },
                    rangeSelector: {
                        enabled: false
                    },

                    exporting: {
                        enabled: false
                    },

                    navigator: {
                        enabled: false
                    },
                    title: {
                        text: ""
                    },
                    legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "top",

                        itemStyle: {
                            color: "#fff",
                            fontWeight: "normal"
                        }
                    },
                    xAxis: {
                        title: {
                            enabled: false
                        },
                        type: "datetime",
                        min: chart8_last_month - 65743595833,
                        max: chart8_last_month,
                        labels: {
                            style: {
                                color: "#fff",
                                fontSize: "11px"
                            }
                        },
                        showLastLabel: true,

                    },
                    yAxis: {
                        title: {
                            text: "",
                            style: {
                                color: "#fff",
                                fontWeight: "normal",
                                fontSize: "12px"
                            }
                        },
                        min: 0,
                        lineColor: "rgba(255,255,255,.16)",
                        tickColor: "rgba(255,255,255,.16)",
                        labels: {
                            formatter: function () {
                                return Highcharts.numberFormat(this.value, 0);
                            },
                            style: {
                                color: "#fff",
                                font: "11px"
                            }
                        },
                    },
                    tooltip: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            stacking: "normal",
                            borderWidth: 0
                        },
                        series: {
                            stacking: "normal",
                            showInNavigator: true,
                            dataGrouping:{
                                enabled: true,
                                type: "column",
                                approximation: "sum",
                                units:[ ["year", [null]]]
                            },
                            pointPadding: 0,
                            groupPadding: 0.2
                        },

                    },
                    series: []
                });
            }

            function loadDataAndBuildChart8() {
                POST("https://statbank.hagstova.fo:443/api/v1/fo/H2/UH/UH01/uh_mcs_t.px", {
                                "query": [{
                "code": "flow",
                "selection": {
                    "filter": "item",
                    "values": [
                    "P61"
                    ]
                }
                },
                {
                "code": "measure",
                "selection": {
                    "filter": "item",
                    "values": [
                    "Value"
                    ]
                }
                },
                {
                "code": "species (MCS)",
                    "selection": {
                    "filter": "item",
                    "values": [
                    "TOTAL",
                    "00100",
                    "00200",
                    "00300",
                    "00400",
                    "00500",
                    "00600",
                    "00700",
                    "00800",
                    "00900",
                    "01000",
                    "01100",
                    "01200",
                    "01300",
                    "01400",
                    "01500",
                    "01600",
                    "01700",
                    "01701",
                    "01800",
                    "01900",
                    "02000",
                    "02100",
                    "02200",
                    "02300",
                    "02400",
                    "02401",
                    "02402",
                    "02403",
                    "02500",
                    "02600",
                    "02700",
                    "02800",
                    "02900",
                    "03000",
                    "03100",
                    "03200",
                    "03300",
                    "03400",
                    "03500",
                    "03600",
                    "03700",
                    "03800",
                    "03900",
                    "04000",
                    "04001",
                    "04002",
                    "04100",
                    "04200",
                    "04300",
                    "04400",
                    "04500",
                    "04600",
                    "04700",
                    "04800",
                    "04900",
                    "05000",
                    "05100",
                    "05200",
                    "05300",
                    "05400",
                    "05500",
                    "05600",
                    "05700",
                    "05800",
                    "05900",
                    "06000",
                    "06100",
                    "06200",
                    "06201",
                    "06202",
                    "06203",
                    "06300",
                    "06400",
                    "06500",
                    "06600",
                    "06700",
                    "06800",
                    "06900",
                    "07000",
                    "07100",
                    "07200",
                    "07300",
                    "07400",
                    "07500",
                    "07600",
                    "07700",
                    "07800",
                    "07900",
                    "08000",
                    "08100",
                    "08200",
                    "08300",
                    "08400",
                    "08500",
                    "08600",
                    "08700",
                    "08800",
                    "08900",
                    "09000",
                    "09100",
                    "09200",
                    "09300",
                    "09400",
                    "09500",
                    "09600",
                    "09700",
                    "09800",
                    "09900",
                    "10000",
                    "10100",
                    "10200",
                    "10300",
                    "10400",
                    "10500",
                    "10600",
                    "10700",
                    "10800",
                    "NON"
                            ]
                        }
                        }
                    ],
                    "response": {
                        "format": "json-stat"

                    }
                },function(data) {
                    chart8Data = data;
                    drawChart8();
                    startAnimatingChart8();
                } );
            }













//---------------------------------------------------------
//                       CHART 9
//---------------------------------------------------------
            var chart9;
            var chart9Data;
            var chart9_last_month;
            var chart9Timeout0;

            function startAnimatingChart9() {
                clearTimeout(chart9Timeout0);

                drawChart9();

                chart9Timeout0 = setTimeout(function () {
                    chart9.update({xAxis: {
                        min: null,
                        max: null
                    }});
                }, 25000);
            }

            //Chart 9 specific functions
            function drawChart9() {
                var jsonStatData = chart9Data;

                //Extrat Data From JSON Stat
                ds = JSONstat(jsonStatData).Dataset(0);
                var months = ds.Dimension("month").id;
                var values = ds.value;
                var gistingardata = [];

                for (var i = 0; i < months.length; i++) {
                    var m = months[i]; // e.g. "2013M01"
                
                    var year = m.substring(0, 4);
                    var month = m.substring(5, 7);
                
                    gistingardata.push([
                        Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, 1),
                        values[i]
                    ]);
                }


                var chart9_last_month = gistingardata[gistingardata.length - 1];
                chart9_last_month = chart9_last_month[0];

                //Build Series
                var createdSeries = [{
                    name: "Gistingar",
                    data: gistingardata,
                    color: "#fff",
                    tooltip: {
                        valueDecimals: 1
                    }
                }
                ];

                //Build Title
                var title = ds.label;

                //Build subtitle
                var subtitle = ds.source;

                //Build Tooltip
                var tooltipFunction = function () {
                    var s = "<b>" + Highcharts.dateFormat("%Y-%b", this.x) + "</b>";
                    $.each(this.points,
                        function (i, point) {
                            s += "<br/>" + point.series.name + ": " + Highcharts.numberFormat(point.y, 0.0, ",", ".");
                        });

                    return s;
                }

                //Build Chart
                $("#chart9").highcharts({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type:"line",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        borderWidth: 0,
                        renderTo: "container",
                        events: {
                            load: function () {
                                chart9 = this;
                            }
                        }
                    }
                    ,
                    rangeSelector: {
                        enabled: false
                    },

                    exporting: {
                        enabled: false
                    },
                    navigator: {
                        enabled: false
                    },
                    title: {
                        text: ""
                    },
                    legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "top",

                        itemStyle: {
                            color: "#fff",
                            fontWeight: "normal"
                        }
                    },
                    xAxis: {
                        title: {
                            enabled: false
                        },                        type: "datetime",
                        lineColor: "rgba(255,255,255,.16)",
                        tickColor: "rgba(255,255,255,.16)",
                        min: chart9_last_month - 65743595833,
                        max: chart9_last_month,
                        labels: {
                            style: {
                                color: "#fff",
                                fontSize: "11px"
                            }
                        }

                    },
                    yAxis: {
                        title: {
                            text: "",
                            style: {
                                color: "#fff",
                                fontWeight: "normal",
                                fontSize: "12px"
                            }
                        },
                        lineColor: "rgba(255,255,255,.16)",
                        tickColor: "rgba(255,255,255,.16)",
                        labels: {
                            formatter: function () {
                                return Highcharts.numberFormat(this.value,0) + "";
                            },
                            style: {
                                color: "#fff",
                                fontSize: "11px"
                            }
                        },
                    },
                    tooltip: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        line: {
                            marker: {
                                enabled: false
                            },
                            dataLabels: {
                                enabled: true,
                                color: "#FFF",
                                useHTML: true,
                                crop: false,
                                overflow: false,
                                formatter: function() {
                                  var last  = this.series.data[this.series.data.length - 1];
                                  if (this.point.category === last.category && this.point.y === last.y) {
                                    return ('<div class="MyDataLabelTooltip"><span class="datetext">' + Highcharts.dateFormat("%b &apos;%y",this.point.x) + "</span><br />" + Highcharts.numberFormat(this.point.y,0) + "</div>");
                                  }
                                  else {return};
                                }
                            }
                        },
                        series: {
                            showInNavigator: true
                        }
                    },
                    series: createdSeries
                });
            }

            function loadDataAndBuildChart9() {
                POST("https://statbank.hagstova.fo:443/api/v1/en/H2/VV/VV07/gist_gist_md.px", {
                  "query": [
                    {
                      "code": "measure",
                      "selection": {
                        "filter": "item",
                        "values": [
                          "OVERN_USED"
                        ]
                      }
                    }
                  ],
                  "response": {
                    "format": "json-stat"
                  }
                }, function(data) {
                    chart9Data = data;
                    drawChart9();
                    startAnimatingChart9();
                });
            }







//---------------------------------------------------------
//                       CHART 10
//---------------------------------------------------------
            var chart10;
            var chart10Data;
            var chart10_last_month;
            var chart10Timeout0;

            function startAnimatingChart10() {
                clearTimeout(chart10Timeout0);

                drawChart10();

                chart10Timeout0 = setTimeout(function () {
                    chart10.update({xAxis: {
                        min: null,
                        max:null,
                    }});
                }, 25000);
            }

            //Chart 10 specific functions
            function drawChart10() {
                var ds = JSONstat(chart10Data).Dataset(0);
                if (!ds) {
                    console.error("Hagvarp: no CPI dataset returned.");
                    return;
                }

                var periodDimension = ds.Dimension("period");
                var yearDimension = ds.Dimension("year");
                var commodityPlural = ds.Dimension("commodity groups");
                var commoditySingular = ds.Dimension("commodity group");
                var commodityDimension = commodityPlural || commoditySingular;
                var pristaldata = [];

                function toTimestamp(period, fallbackYear) {
                    var value = String(period || "");
                    var m = value.match(/^(\d{4})M(\d{1,2})$/i);
                    if (m) return Date.UTC(+m[1], +m[2] - 1, 1);
                    m = value.match(/^(\d{4})Q([1-4])$/i);
                    if (m) return Date.UTC(+m[1], (+m[2] - 1) * 3, 1);
                    m = value.match(/^Q([1-4])$/i);
                    if (m && fallbackYear) return Date.UTC(+fallbackYear, (+m[1] - 1) * 3, 1);
                    var parsed = Date.parse(value);
                    return isNaN(parsed) ? null : parsed;
                }

                function commoditySelector() {
                    var selector = {};
                    if (!commodityDimension || !commodityDimension.id || !commodityDimension.id.length) return selector;
                    var id = commodityDimension.id.indexOf("CPI") >= 0 ? "CPI" : commodityDimension.id[0];
                    selector[commodityPlural ? "commodity groups" : "commodity group"] = id;
                    return selector;
                }

                if (periodDimension && !yearDimension) {
                    var periods = periodDimension.id || [];
                    var values = ds.Data(commoditySelector(), false);
                    values = Array.isArray(values) ? values : [values];
                    for (var p = 0; p < periods.length && p < values.length; p++) {
                        var ts = toTimestamp(periods[p]);
                        if (ts !== null && values[p] !== null && values[p] !== undefined) {
                            pristaldata.push([ts, values[p]]);
                        }
                    }
                } else if (periodDimension && yearDimension) {
                    var years = yearDimension.id || [];
                    var oldPeriods = periodDimension.id || [];
                    for (var i = 0; i < years.length; i++) {
                        var query = commoditySelector();
                        query.year = years[i];
                        var oldValues = ds.Data(query, false) || [];
                        for (var j = 0; j < oldValues.length && j < oldPeriods.length; j++) {
                            var oldTs = toTimestamp(oldPeriods[j], years[i]);
                            if (oldTs !== null && oldValues[j] !== null && oldValues[j] !== undefined) {
                                pristaldata.push([oldTs, oldValues[j]]);
                            }
                        }
                    }
                }

                pristaldata.sort(function(a,b){ return a[0]-b[0]; });
                if (!pristaldata.length) {
                    console.error("Hagvarp: CPI data contained no usable observations.", chart10Data);
                    return;
                }

                var lastDate = pristaldata[pristaldata.length - 1][0];
                $("#chart10").highcharts({
                    credits: { enabled: false },
                    chart: {
                        type: "line",
                        backgroundColor: "rgba(255,255,255,0)",
                        borderWidth: 0,
                        events: { load: function(){ chart10 = this; } }
                    },
                    exporting: { enabled: false },
                    title: { text: "" },
                    legend: { enabled: false },
                    xAxis: {
                        type: "datetime",
                        min: lastDate - (1000 * 60 * 60 * 24 * 730),
                        max: lastDate,
                        lineColor: "rgba(255,255,255,.16)",
                        tickColor: "rgba(255,255,255,.16)",
                        labels: {
                            formatter: function(){
                                var month = parseInt(Highcharts.dateFormat("%m", this.value),10);
                                return "Q" + (Math.floor((month - 1) / 3) + 1) + " '" + Highcharts.dateFormat("%y", this.value);
                            },
                            style: { color: "#fff", fontSize: "11px" }
                        }
                    },
                    yAxis: {
                        title: { text: "" },
                        labels: {
                            formatter: function(){ return Highcharts.numberFormat(this.value,1); },
                            style: { color: "#fff", fontSize: "11px" }
                        }
                    },
                    tooltip: { enabled: false },
                    plotOptions: {
                        line: {
                            marker: { enabled: false },
                            dataLabels: {
                                enabled: true,
                                useHTML: true,
                                crop: false,
                                overflow: false,
                                formatter: function(){
                                    var last = this.series.data[this.series.data.length - 1];
                                    if (this.point.x !== last.x) return;
                                    var month = parseInt(Highcharts.dateFormat("%m", this.point.x),10);
                                    var quarter = Math.floor((month - 1) / 3) + 1;
                                    return '<div class="MyDataLabelTooltip"><span class="datetext">' + quarter + '. ársfj. ' + Highcharts.dateFormat('%Y', this.point.x) + '</span><br />' + Highcharts.numberFormat(this.point.y,1) + '</div>';
                                }
                            }
                        }
                    },
                    series: [{ name: "Prístalið", data: pristaldata, color: "#fff" }]
                });
            }

            function loadDataAndBuildChart10() {
                POST("https://statbank.hagstova.fo:443/api/v1/fo/H2/IP/IP02/pris_alt_t.px", {
                    "query": [
                            {
                              "code": "Measure",
                              "selection": {
                                "filter": "item",
                                "values": [
                                  "INDEX"
                                ]
                              }
                            }


                    ],
                    "response": {
                        "format": "json-stat"
                    }
                }, function(data) {
                    chart10Data = data;
                    drawChart10();
                    startAnimatingChart10();
                });
            }






            //HELPER FUNCTION
            function POST(url, query, main) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(query),
                    success: function(data) {
                        main(data);
                    }
                });
            }

            //START LOADING AND BUILDING CHARTS
            $(function () {
                loadDataAndBuildChart1();
                loadDataAndBuildChart2();
                loadDataAndBuildChart3();
                loadDataAndBuildChart4();
                loadDataAndBuildChart4b();
                loadDataAndBuildChart5();
                loadDataAndBuildChart6();
                loadDataAndBuildChart7();
                loadDataAndBuildChart8();
                loadDataAndBuildChart9();
                loadDataAndBuildChart10();

                
            });
