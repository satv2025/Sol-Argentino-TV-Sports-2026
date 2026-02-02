// Función para obtener los datos de Promiedos
const fetchData = async () => {
  try {
    // Hacer la solicitud a la API de Promiedos
    const response = await fetch('https://www.promiedos.com.ar/league/liga-profesional/hc');
    const data: { zonaA: Team[], zonaB: Team[], fixture: Fixture } = await response.json();
    
    // Procesar los datos de zonaA y zonaB
    renderTable('zonaA', data.zonaA);
    renderTable('zonaB', data.zonaB);

    // Procesar los fixtures
    renderFixtures(data.fixture["Fecha actual"]);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
};

// Interfaz para el formato de la respuesta de la API
interface Team {
  num: number;
  values: {
    key: string;
    value: string;
  }[];
  entity: {
    type: number;
    object: {
      name: string;
      short_name: string;
      url_name: string;
      id: string;
      country_id: string;
      allow_open: boolean;
      colors: {
        color: string;
        text_color: string;
      };
    };
  };
  destination_color: string;
}

interface Fixture {
  "Fecha actual": {
    id: string;
    stage_round_name: string;
    winner: number;
    teams: {
      name: string;
      short_name: string;
      url_name: string;
      id: string;
      country_id: string;
      allow_open: boolean;
      colors: {
        color: string;
        text_color: string;
      };
      red_cards: number;
      goals: {
        player_name: string;
        player_sname: string;
        time: string;
        time_to_display: string;
        goal_type?: string;
      }[];
    }[];
    url_name: string;
    scores: [number, number];
    status: {
      enum: number;
      name: string;
      short_name: string;
      symbol_name: string;
    };
    start_time: string;
    game_time: number;
    game_time_to_display: string;
    game_time_status_to_display: string;
  }[];
}

// Llamar a fetchData para cargar los datos
fetchData();