async function convertir() {
    const amount = document.getElementById('amount').value;
    divisaSeleccionada = document.getElementById('divisa').value;

    if (!divisaSeleccionada) {
        console.error('Por favor, selecciona una divisa.');
        return;
    }

    try {
        const response = await fetch(`https://mindicador.cl/api/${divisaSeleccionada}`);
        const data = await response.json();

        const valorConvertido = amount / data.serie[0].valor;

    document.getElementById('resultado').innerHTML = `${amount} CLP es igual a ${valorConvertido.toFixed(2)} ${data.codigo}`;
    document.getElementById('resultado').style.width = "20rem";
    document.getElementById('resultado').style.height = "2rem";
      cargarGrafico();
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

let myChart; 

async function cargarGrafico() {
    if (!divisaSeleccionada) {
        console.error('No hay una divisa seleccionada para cargar el gráfico.');
        return;
    }

    try {
        const response = await fetch(`https://mindicador.cl/api/${divisaSeleccionada}`);
        const data = await response.json();

        const fechas = data.serie.slice(0, 10).map(item => item.fecha.substring(0, 10));
        const valores = data.serie.slice(0, 10).map(item => item.valor);

        const ctx = document.getElementById('myChart').getContext('2d');

        
        if (myChart) {
            // Actualizar datos del gráfico existente
            myChart.data.labels = fechas;
            myChart.data.datasets[0].data = valores;
            myChart.update();
        } else {
           
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: fechas,
                    datasets: [{
                        label: `Valor histórico de la divisa`,
                        data: valores,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            labels: fechas,
                            display: true,
                        },
                        y: {
                            
                        }
                    },
                    elements: {
                        line: {
                            fill: false 
                        }
                    },
                    plugins: {
                        legend: {
                            display: true
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    backgroundColor: 'white'
                }
            });
        }
    } catch (error) {
        console.error('Error al cargar el gráfico:', error);
    }
}
