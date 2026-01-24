import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Prenotazioni } from './prenotazioni/prenotazioni';
import { Clienti } from './clienti/clienti';
import { Servizi } from './servizi/servizi';
import { Staff } from './staff/staff';
import { Impostazioni} from './impostazioni/impostazioni';
import { ImpostazioniGenerali } from './impostazioni-generali/impostazioni-generali';
import { CalendarioOrario } from './calendario-orario/calendario-orario';
import { ImpostazioniNotifiche } from './impostazioni-notifiche/impostazioni-notifiche';
import { ImpostazioniPagamenti } from './impostazioni-pagamenti/impostazioni-pagamenti';
import { ImpostazioniPrivacySicurezza } from './impostazioni-privacy-sicurezza/impostazioni-privacy-sicurezza';
import { ConfermaPrenotazioni } from './conferma-prenotazioni/conferma-prenotazioni';


export const routes: Routes = [
    {path: '', component: Login },
    {path: 'home', component: Home},
    {path:'confermaPrenotazioniPage',component:ConfermaPrenotazioni},
    {path:'prenotazioni',component:Prenotazioni},
    {path:'clienti',component:Clienti},
    {path:'servizi', component:Servizi},
    {path:'staff',component:Staff},
    {path:'impostazioni',component:Impostazioni,
     children: [
        {path: '', redirectTo: 'impostazioniGenerali', pathMatch: 'full' },
        {path:'impostazioniGenerali', component: ImpostazioniGenerali},
        {path:'calendarioOrario',component:CalendarioOrario},
        {path:'impostazioniNotifiche',component:ImpostazioniNotifiche},
        {path:'impostazioniPagamenti',component:ImpostazioniPagamenti},
        {path:'impostazioniPrivacySicurezza',component:ImpostazioniPrivacySicurezza}]
    },
];
