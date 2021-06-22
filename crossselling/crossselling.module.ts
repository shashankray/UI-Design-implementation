import { NgModule } from '@angular/core';
import { CommonModule } from '../../../shared/commonauditlogmodel/commonauditlog.module';
import { SharedModule } from '../../../shared/shared.module';
import { CrosssellingComponent } from './crossselling.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [CrosssellingComponent],
    exports: [CrosssellingComponent]
})

export class CrosssellingModule { }
