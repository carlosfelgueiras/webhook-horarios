import 'dotenv/config';
import axios from 'axios';

const cadeiras = [
    {
        cadeira: "283085589468167",
        turno: "PLic23-2OT03",
        required: 1
    },
    {
        cadeira: "283085589467648",
        turno: "SDis23L07",
        required: 4,
    }
];

async function scanCadeiras() {
    cadeiras.forEach(cadeira => {
        axios.get(`https://fenix.tecnico.ulisboa.pt/tecnico-api/v2/courses/${cadeira.cadeira}/schedule`)
        .then(response => {
            if (response.data.shifts.filter(shift => shift.name === cadeira.turno).length < 1) {
                return;
            }

            const shift = response.data.shifts.filter(shift => shift.name === cadeira.turno)[0];

            if (shift.enrolments.current + cadeira.required <= shift.enrolments.maximum) {
                sendWarning(cadeira.turno, shift.enrolments.current, shift.enrolments.maximum);
            }
        })
    })
}

function sendWarning(turno: String, current: Number, maximum: Number) {
    const webhookContent = {
        "username": "Turnos LEIC",
        "content": `@everyone, encontrei vagas no turno ${turno}!`,
        "embeds": [
            {
                "title": `Vagas no turno ${turno} (${current}/${maximum})`,
                "description": "Clica [aqui](https://fenix.tecnico.ulisboa.pt/student/studentShiftEnrollmentManager.do) para ires para a página dos turnos",
                "color": 16711680
            }
        ]
    }
    
    axios.post(process.env.WEBHOOK_URL, webhookContent);
}

scanCadeiras();
setInterval(scanCadeiras, 30000);