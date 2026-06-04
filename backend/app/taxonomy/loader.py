"""Load and index taxonomy categories from JSON files."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from app.taxonomy.schema import TaxonomyCategory, TaxonomyIndex

DEFAULT_DATA_DIR = Path(__file__).parent.parent / "data" / "taxonomy"


class TaxonomyLoader:
    """Loads all taxonomy category JSON files and builds an index."""

    def __init__(self, data_dir: Optional[Path] = None):
        self.data_dir = data_dir or DEFAULT_DATA_DIR
        self._categories: dict[str, TaxonomyCategory] = {}
        self._index: Optional[TaxonomyIndex] = None

    def load_all(self) -> dict[str, TaxonomyCategory]:
        """Load and validate all taxonomy JSON files from data directory."""
        self._categories = {}
        json_files = sorted(self.data_dir.glob("*.json"))

        for json_file in json_files:
            if json_file.name == "taxonomy_index.json":
                continue
            raw = json.loads(json_file.read_text(encoding="utf-8"))
            category = TaxonomyCategory.model_validate(raw)
            self._categories[category.category_id] = category

        self._index = self._build_index()
        return self._categories

    @property
    def categories(self) -> dict[str, TaxonomyCategory]:
        if not self._categories:
            self.load_all()
        return self._categories

    @property
    def index(self) -> TaxonomyIndex:
        if self._index is None:
            self.load_all()
        assert self._index is not None
        return self._index

    def get_category(self, category_id: str) -> Optional[TaxonomyCategory]:
        return self.categories.get(category_id)

    def get_by_parent(self, parent: str) -> list[TaxonomyCategory]:
        return [c for c in self.categories.values() if c.parent_category == parent]

    def get_by_type(self, category_type: str) -> list[TaxonomyCategory]:
        return [c for c in self.categories.values() if c.category_type.value == category_type]

    def _build_index(self) -> TaxonomyIndex:
        """Build taxonomy index from loaded categories."""
        categories_map: dict[str, str] = {}
        parent_categories: dict[str, list[str]] = {}
        category_types: dict[str, list[str]] = {}
        adjacency_graph: dict[str, list[str]] = {}

        for cat in self._categories.values():
            # category_id → filename
            categories_map[cat.category_id] = f"{cat.category_id}.json"

            # parent → children
            parent_categories.setdefault(cat.parent_category, []).append(cat.category_id)

            # type → categories
            category_types.setdefault(cat.category_type.value, []).append(cat.category_id)

            # adjacency
            adjacency_graph[cat.category_id] = cat.adjacent_categories

        return TaxonomyIndex(
            categories=categories_map,
            parent_categories=parent_categories,
            category_types=category_types,
            adjacency_graph=adjacency_graph,
        )

    def save_index(self, output_path: Optional[Path] = None) -> Path:
        """Save computed index to JSON file."""
        path = output_path or (self.data_dir / "taxonomy_index.json")
        index_data = self.index.model_dump()
        path.write_text(json.dumps(index_data, indent=2, ensure_ascii=False), encoding="utf-8")
        return path
