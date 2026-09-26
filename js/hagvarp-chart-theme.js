/* Hagvarp 2026 chart language
 * Shared Highcharts defaults for a calmer, broadcast-first visual system.
 * Loaded after hagvarp-charts.js is parsed, but before DOM ready builds charts.
 */
(function (H) {
  if (!H) return;

  var ink = 'rgba(255,255,255,.86)';
  var muted = 'rgba(255,255,255,.52)';
  var faint = 'rgba(255,255,255,.10)';
  var axis = 'rgba(255,255,255,.16)';

  H.setOptions({
    colors: ['#67C77A', '#E96864', '#91D59D', '#F0928F', '#DCEFE0', '#FFFFFF'],

    chart: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      spacing: [10, 8, 8, 8],
      animation: {
        duration: 1100
      },
      style: {
        fontFamily: "'Open Sans', Arial, sans-serif"
      }
    },

    title: {
      style: {
        color: '#fff',
        fontSize: '18px',
        fontWeight: '700'
      }
    },

    subtitle: {
      style: {
        color: muted,
        fontSize: '12px'
      }
    },

    xAxis: {
      lineColor: axis,
      lineWidth: 1,
      tickColor: axis,
      tickLength: 0,
      tickPixelInterval: 95,
      gridLineWidth: 0,
      labels: {
        style: {
          color: muted,
          fontSize: '11px',
          fontWeight: '600'
        }
      }
    },

    yAxis: {
      lineWidth: 0,
      tickWidth: 0,
      gridLineColor: faint,
      gridLineWidth: 1,
      gridLineDashStyle: 'ShortDash',
      labels: {
        x: -8,
        style: {
          color: muted,
          fontSize: '11px',
          fontWeight: '600'
        }
      },
      title: {
        style: {
          color: muted,
          fontSize: '11px',
          fontWeight: '600'
        }
      }
    },

    legend: {
      itemDistance: 22,
      symbolRadius: 6,
      symbolWidth: 12,
      itemStyle: {
        color: ink,
        fontSize: '11px',
        fontWeight: '600'
      },
      itemHoverStyle: {
        color: '#fff'
      },
      itemHiddenStyle: {
        color: 'rgba(255,255,255,.28)'
      }
    },

    tooltip: {
      backgroundColor: 'rgba(5,20,32,.96)',
      borderColor: 'rgba(255,255,255,.16)',
      borderRadius: 4,
      shadow: false,
      style: {
        color: '#fff',
        fontSize: '12px'
      }
    },

    plotOptions: {
      series: {
        animation: {
          duration: 1200
        },
        states: {
          hover: {
            lineWidthPlus: 1
          },
          inactive: {
            opacity: 0.32
          }
        },
        marker: {
          symbol: 'circle',
          radius: 3,
          lineWidth: 2,
          lineColor: '#fff'
        }
      },
      line: {
        lineWidth: 4,
        marker: {
          enabled: false
        }
      },
      spline: {
        lineWidth: 4,
        marker: {
          enabled: false
        }
      },
      column: {
        borderWidth: 0,
        groupPadding: 0.18,
        pointPadding: 0.07,
        maxPointWidth: 30
      },
      area: {
        lineWidth: 3,
        fillOpacity: 0.14,
        marker: {
          enabled: false
        }
      }
    },

    credits: { enabled: false },
    exporting: { enabled: false }
  });

  // Give every freshly rendered chart a subtle modern finishing pass without
  // changing its data or the existing animation logic.
  H.addEvent(H.Chart, 'load', function () {
    var chart = this;

    chart.series.forEach(function (series) {
      if (!series || !series.points || !series.points.length) return;

      var last = series.points[series.points.length - 1];
      var isLine = series.type === 'line' || series.type === 'spline' || series.type === 'area' || series.type === 'areaspline';

      if (isLine && last && last.update) {
        last.update({
          marker: {
            enabled: true,
            radius: 5,
            lineWidth: 3,
            lineColor: '#fff',
            fillColor: series.color
          }
        }, false);
      }
    });

    chart.redraw(false);
  });
})(window.Highcharts);
