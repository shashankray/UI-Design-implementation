import { Route } from '@angular/router';
import { CrosssellingComponent } from './index';
import { AuthGuard } from '../../../login/auth-guard.service';

export const CrosssellingRoutes: Route[] = [
    {
        path: 'crossselling',
        component: CrosssellingComponent,
        canActivate: [AuthGuard]
    }
];
