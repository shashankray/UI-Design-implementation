import { Route } from '@angular/router';
import { PropensitypredictionComponent } from './index';
import { AuthGuard } from '../../../login/auth-guard.service';

export const PropensitypredictionRoutes: Route[] = [
    {
        path: 'propensityprediction',
        component: PropensitypredictionComponent,
        canActivate: [AuthGuard]
    }
];
