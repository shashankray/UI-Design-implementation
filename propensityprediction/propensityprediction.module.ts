import { NgModule } from '@angular/core';
import { CommonModule } from '../../../shared/commonauditlogmodel/commonauditlog.module';
import { SharedModule } from '../../../shared/shared.module';
import { PropensitypredictionComponent } from './propensityprediction.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [PropensitypredictionComponent],
    exports: [PropensitypredictionComponent]
})

export class PropensitypredictionModule { }
