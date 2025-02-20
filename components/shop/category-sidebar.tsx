"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export function CategorySidebar() {
  const t = useTranslations("search")

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h3 className="mb-4 text-sm font-semibold">{t("sort.title")}</h3>
        <RadioGroup defaultValue="relevance" className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="relevance" id="relevance" />
            <Label htmlFor="relevance">{t("sort.relevance")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="trending" id="trending" />
            <Label htmlFor="trending">{t("sort.trending")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="latest" id="latest" />
            <Label htmlFor="latest">{t("sort.latest")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-asc" id="price-asc" />
            <Label htmlFor="price-asc">{t("sort.price_asc")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-desc" id="price-desc" />
            <Label htmlFor="price-desc">{t("sort.price_desc")}</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator className="bg-border/60" />

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="size" className="border-border/60">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox id={size.toLowerCase()} />
                  <label
                    htmlFor={size.toLowerCase()}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="color" className="border-border/60">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {[
                { id: "black", label: "Black" },
                { id: "white", label: "White" },
                { id: "blue", label: "Blue" },
              ].map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox id={color.id} />
                  <label
                    htmlFor={color.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {color.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  )
}

