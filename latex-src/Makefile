# Makefile to simplify compilation process

DOCNAME=survey

all: survey

.PHONY: clean

survey:
	pdflatex $(DOCNAME).tex
	bibtex $(DOCNAME).aux
	pdflatex $(DOCNAME).tex
	pdflatex $(DOCNAME).tex

view: survey
	open $(DOCNAME).pdf

clean:
	rm *.blg *.bbl *.aux *.log
