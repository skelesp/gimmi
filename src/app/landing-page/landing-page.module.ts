import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { SharedModule } from '../shared/shared.module';
import { LandingPageBannerComponent } from './landing-page-banner/landing-page-banner.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { SocialButtonsComponent } from './social-buttons/social-buttons.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { PeopleModule } from '../people/people.module';


@NgModule({
  declarations: [
    LandingPageComponent, 
    LandingPageBannerComponent, 
    HowToUseComponent, 
    SocialButtonsComponent, 
    PrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    SharedModule,
    PeopleModule
  ]
})
export class LandingPageModule { }
