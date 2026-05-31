import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

@NgModule({
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([])
  ]
})
class GlobalTestingSetupModule {}

// Initialize the Angular testing environment with default mock modules!
getTestBed().initTestEnvironment(
  [BrowserTestingModule, GlobalTestingSetupModule],
  platformBrowserTesting()
);
