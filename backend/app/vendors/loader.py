"""Load vendor profiles from JSON seed data."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from app.vendors.schema import VendorProfile

DEFAULT_DATA_DIR = Path(__file__).parent.parent / "data" / "vendors"


class VendorLoader:
    """Loads all vendor profile JSON files."""

    def __init__(self, data_dir: Optional[Path] = None):
        self.data_dir = data_dir or DEFAULT_DATA_DIR
        self._vendors: dict[str, VendorProfile] = {}

    def load_all(self) -> dict[str, VendorProfile]:
        """Load and validate all vendor JSON files."""
        self._vendors = {}
        if not self.data_dir.exists():
            return self._vendors

        json_files = sorted(self.data_dir.glob("*.json"))
        for json_file in json_files:
            raw = json.loads(json_file.read_text(encoding="utf-8"))
            vendor = VendorProfile.model_validate(raw)
            self._vendors[vendor.vendor_id] = vendor

        return self._vendors

    @property
    def vendors(self) -> dict[str, VendorProfile]:
        if not self._vendors:
            self.load_all()
        return self._vendors

    def get_vendor(self, vendor_id: str) -> Optional[VendorProfile]:
        return self.vendors.get(vendor_id)

    def get_by_category(self, category_id: str) -> list[VendorProfile]:
        """Get all vendors that serve a specific category."""
        return [
            v for v in self.vendors.values()
            if category_id in v.category_ids
        ]
