import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeatureFlagService } from '../../services/feature-flag.service';
import { FeatureFlag } from '../../models/admin.models';

@Component({
  selector: 'app-feature-flags',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feature-flags.component.html',
  styleUrls: ['./feature-flags.component.css']
})
export class FeatureFlagsComponent implements OnInit {
  featureFlags: FeatureFlag[] = [];
  loading = true;
  error: string | null = null;
  togglingFlags: Set<string> = new Set();

  constructor(private featureFlagService: FeatureFlagService) {}

  ngOnInit(): void {
    this.loadFeatureFlags();
  }

  loadFeatureFlags(): void {
    this.featureFlagService.getFeatureFlags().subscribe({
      next: (flags) => {
        this.featureFlags = flags;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load feature flags';
        this.loading = false;
      }
    });
  }

  toggleFlag(flag: FeatureFlag): void {
    this.togglingFlags.add(flag.id);
    const newState = !flag.enabled;
    
    this.featureFlagService.toggleFeatureFlag(flag.id, newState).subscribe({
      next: (updatedFlag) => {
        flag.enabled = updatedFlag.enabled;
        flag.updatedAt = updatedFlag.updatedAt;
        this.togglingFlags.delete(flag.id);
      },
      error: (err) => {
        this.togglingFlags.delete(flag.id);
        console.error('Failed to toggle feature flag', err);
      }
    });
  }

  isToggling(flagId: string): boolean {
    return this.togglingFlags.has(flagId);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}
