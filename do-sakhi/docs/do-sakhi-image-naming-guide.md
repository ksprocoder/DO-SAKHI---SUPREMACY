# Do Sakhi — Product Image Naming Guide

All product images must follow this naming convention before being uploaded to Cloudflare R2 or the admin panel. Consistent naming ensures the platform renders images correctly across the shop grid, PDP gallery, cart, and admin table.

---

## Naming Format

```
product-slug_role.extension
```

- **Separator:** Underscore `_` between slug and role  
- **Slug:** Lowercase, hyphen-separated product name (same as the product's URL slug)  
- **Role:** One of the standard roles listed below  
- **Extension:** `.jpg` preferred (also accept `.webp`, `.png`)

---

## Standard Roles

| Role | Description | Example File Name |
|---|---|---|
| `front` | Primary front-facing view | `ivory-leaf-suit-set_front.jpg` |
| `side` | Side profile view | `ivory-leaf-suit-set_side.jpg` |
| `back` | Back view | `ivory-leaf-suit-set_back.jpg` |
| `fabric` | Fabric or print close-up | `ivory-leaf-suit-set_fabric.jpg` |
| `detail` | Embroidery or detail close-up | `ivory-leaf-suit-set_detail.jpg` |
| `drape` | Dupatta or drape view | `ivory-leaf-suit-set_drape.jpg` |
| `lifestyle` | Lifestyle or model editorial | `ivory-leaf-suit-set_lifestyle.jpg` |

---

## Image Quality Rules

| Rule | Requirement |
|---|---|
| **Aspect Ratio** | 4:5 vertical (crop carefully so the garment is centered) |
| **Resolution** | Minimum 1200 × 1500 px; maximum 2400 × 3000 px |
| **File Size** | Under 500 KB after compression (use TinyPNG or Squoosh) |
| **Format** | `.jpg` (AVIF/WebP delivered automatically by CDN) |
| **Background** | White or soft ivory preferred for consistency |
| **Focus** | Sharp on garment; never blurry or stretched |
| **Colour Accuracy** | Must accurately represent the actual fabric colour |

---

## Upload Order (Critical)

1. Always upload `_front` **first** — it becomes the primary thumbnail.
2. Then `_side`, `_back`, `_fabric`, `_detail`, `_drape`, `_lifestyle` in order.
3. The PDP gallery displays images in the order they are uploaded.

---

## Examples

For a product with slug `dusty-rose-chikankari-co-ord`:

```
dusty-rose-chikankari-co-ord_front.jpg      ← Upload first (thumbnail)
dusty-rose-chikankari-co-ord_side.jpg
dusty-rose-chikankari-co-ord_back.jpg
dusty-rose-chikankari-co-ord_fabric.jpg
dusty-rose-chikankari-co-ord_detail.jpg
dusty-rose-chikankari-co-ord_drape.jpg
dusty-rose-chikankari-co-ord_lifestyle.jpg  ← Optional
```

---

## Common Mistakes to Avoid

| Wrong | Correct |
|---|---|
| `front-ivory-suit.jpg` | `ivory-leaf-suit-set_front.jpg` |
| `ivory-leaf-suit-set-front.jpg` (hyphen separator) | `ivory-leaf-suit-set_front.jpg` (underscore) |
| `IMG_3842.jpg` | Rename before upload |
| `Ivory Leaf Suit Set Front.jpg` (spaces) | `ivory-leaf-suit-set_front.jpg` |
| `ivory_leaf_suit_set_front.jpg` (underscores in slug) | `ivory-leaf-suit-set_front.jpg` |

---

> **If only one image is available**, name it `product-slug_front.jpg` and upload it.  
> Missing angles should be documented in the Product Intake Template for future shoots.
