#include <iostream>
#include <string.h>
#include <stdlib.h>
#include <algorithm>
#include <deque>

#include <qpdf/QPDF.hh>
#include <qpdf/QPDFPageDocumentHelper.hh>
#include <qpdf/QPDFPageObjectHelper.hh>
#include <qpdf/QUtil.hh>
#include <qpdf/QPDFWriter.hh>
#include <qpdf/QPDFObjectHandle.hh>

static char const* whoami = 0;

void usage()
{
    std::cerr << "Usage: " << whoami << " infile outfile [brightness 0-3]" << std::endl
	      << "Applies DarkFilter to infile and writes outfile"
              << std::endl;
    exit(2);
}

//DarkFilter first adds a dark gray background to the page
//then finds all colour operators in the content, inverting and
//normalizing their values. The intent is to produce a pdf that causes
//less strain on the eyes to read digitally.
class DarkFilter: public QPDFObjectHandle::TokenFilter
{
  public:
    DarkFilter(QPDFPageObjectHelper page, std::vector<int>options) 
    {
        setPageSize(page);
        lowerLimit = (0.075 * options[0]);
        upperLimit = (0.7 + (0.075 * options[0]));
    };
    virtual ~DarkFilter()
    {
    }
    virtual void handleToken(QPDFTokenizer::Token const&);
    virtual void handleEOF();
    virtual void setPageSize(QPDFPageObjectHelper);

  private:
    bool isNumeric(QPDFTokenizer::token_type_e);
    bool isIgnorable(QPDFTokenizer::token_type_e);
    bool tokenInList(
        QPDFTokenizer::Token const&,
        std::vector<std::string>);
    double normalizedValue(QPDFTokenizer::Token const&);

    std::deque<QPDFTokenizer::Token> all_stack;
    std::deque<QPDFTokenizer::Token> stack;
    std::deque<QPDFTokenizer::Token> rg_stack;
    std::string page_size;
    double lowerLimit;
    double upperLimit;
    bool contentBegin = true;
    std::vector<std::string>cmyk_operators = {"k","K"};
    std::vector<std::string>rgb_operators = {"rg","RG"};
    std::vector<std::string>sc_operators = {"sc","SC","scn","SCN"};
    std::vector<std::string>g_operators = {"g","G"};
};

bool
DarkFilter::isNumeric(QPDFTokenizer::token_type_e token_type)
{
    return ((token_type == QPDFTokenizer::tt_integer) ||
            (token_type == QPDFTokenizer::tt_real));
}

bool
DarkFilter::isIgnorable(QPDFTokenizer::token_type_e token_type)
{
    return ((token_type == QPDFTokenizer::tt_space) ||
            (token_type == QPDFTokenizer::tt_comment));
}

double
DarkFilter::normalizedValue(QPDFTokenizer::Token const& token)
{
    //keeps values between lower and upper brightness limits

    //parse
    double val = QPDFObjectHandle::parse(token.getValue()).getNumericValue();
    //invert
    val = 1 - val;
    if (val > this->upperLimit)
    {
        return this->upperLimit;
    } else if (val < this->lowerLimit) 
    {
        return this->lowerLimit;
    }
    return val;
}

bool
DarkFilter::tokenInList(
    QPDFTokenizer::Token const& token,
    std::vector<std::string> operator_list)
{
    unsigned int i;
    for(i = 0; i < operator_list.size(); i++)
    {
        if(token == QPDFTokenizer::
        Token(QPDFTokenizer::tt_word, operator_list[i]))
        {
            return true;
        }
    }
    return false;
}

void
DarkFilter::handleToken(QPDFTokenizer::Token const& token)
{
    //flush out any space or comment tokens
    while ((! this->all_stack.empty()) &&
           isIgnorable(this->all_stack.at(0).getType()))
    {
        writeToken(this->all_stack.at(0));
        this->all_stack.pop_front();
    }
    //store the incoming token
    this->all_stack.push_back(token);

    //On first loop, add the gray background to the content stream.
    //Some pdf files will have a background already, making
    //this redundant.

    
    if (contentBegin && (this->page_size != "")) {
        std::string brightness = QUtil::double_to_string(lowerLimit);
        write("/Artifact BMC q " + brightness + " g ");
        write(this->page_size);
        write("re f Q EMC\n0.850 g\n0.850 G\n");
        this->contentBegin = false;
    }
    

    std::string oper;
    QPDFTokenizer::token_type_e token_type = token.getType();
    if(token_type == QPDFTokenizer::tt_word) {
        oper = token.getValue();
    }

    if (! isIgnorable(token_type))
    {
        //cmyk takes the most operands so stack size must be 5
        //if incoming token is a cmyk operator preceded by
        //correct operands then invert and normalize values.
        //Empty both stacks when done.
        this->stack.push_back(token);
        if ((this->stack.size() == 5) &&
            (tokenInList(token, cmyk_operators) ||
             tokenInList(token, sc_operators)) &&
            (isNumeric(this->stack.at(0).getType())) &&
            (isNumeric(this->stack.at(1).getType())) &&
            (isNumeric(this->stack.at(2).getType())) &&
            (isNumeric(this->stack.at(3).getType())))
        {
            std::vector<double> cmyk(4);
            unsigned int i;
            for(i = 0; i < 4; i++) 
            {
                cmyk[i] = normalizedValue(this->stack.at(i));
                write(QUtil::double_to_string(cmyk[i], 3) + " ");
            }
            write(token.getValue());
            this->stack.clear();
            this->all_stack.clear();

        //Look at fourth position in stack, if it is an rgb
        //operator preceded by the correct operands
        //then invert and normalize values. Flush both stacks
        //until only new tokens remain.
        } else if ((this->stack.size() == 5) &&
            (tokenInList(this->stack.at(3), rgb_operators) ||
             tokenInList(this->stack.at(3), sc_operators)) &&
            (isNumeric(this->stack.at(0).getType())) &&
            (isNumeric(this->stack.at(1).getType())) &&
            (isNumeric(this->stack.at(2).getType())))
        {
            std::vector<double> rgb(3);
            unsigned int i;
            for(i = 0; i < 3; i++) {
                rgb[i] = normalizedValue(this->stack.at(i));
                write(QUtil::double_to_string(rgb[i], 3) + " ");
            }
            write(this->stack.at(3).getValue());
            while(! this->all_stack.empty())
            {
                if (this->all_stack.at(0) == this->stack.at(3))
                {
                   this->all_stack.pop_front();
                   break; 
                }  else
                {
                    this->all_stack.pop_front();
                }
            }
            this->stack.pop_front();
            this->stack.pop_front();
            this->stack.pop_front();
            this->stack.pop_front();

        //Look at second position in stack, if it is a gray
        //operator preceded by the correct operand
        //then invert and normalize value. Flush both stacks
        //until only new tokens remain.
        } else if ((this->stack.size() == 5) &&
            (tokenInList(this->stack.at(1), g_operators) ||
             tokenInList(this->stack.at(1), sc_operators)) &&
            (isNumeric(this->stack.at(0).getType())))
        {
            double gray = normalizedValue(this->stack.at(0));
            write(QUtil::double_to_string(gray, 3));
            write(" ");
            write(this->stack.at(1).getValue());
            while(! this->all_stack.empty()) 
            {
                if (this->all_stack.at(0) == this->stack.at(1))
                {
                   this->all_stack.pop_front();
                   break; 
                }  else
                {
                    this->all_stack.pop_front();
                }
            }
            this->stack.pop_front();
            this->stack.pop_front();
        }
    }

    if (this->stack.size() == 5)
    {
        writeToken(this->all_stack.at(0));
        this->all_stack.pop_front();
        this->stack.pop_front();
    }
}

void
DarkFilter::handleEOF()
{
    // Flush out any remaining accumulated tokens.
    while (! this->all_stack.empty())
    {
        writeToken(this->all_stack.at(0));
        this->all_stack.pop_front();
    }
}


void
DarkFilter::setPageSize(QPDFPageObjectHelper page)
{
    //Store current page mediabox values in a string
    QPDFObjectHandle mediaBox = page.getMediaBox();
    for(int i = 0; i < 4; i++) {
        if (mediaBox.getArrayItem(i).isReal()) {
            std::string realItem = mediaBox.getArrayItem(i).getRealValue();
            this->page_size = this->page_size + realItem + " ";
        } else {
            long long intItem = mediaBox.getArrayItem(i).getIntValue();
            this->page_size = this->page_size + std::to_string(intItem) + " ";
        }
    }
}


int main(int argc, char* argv[])
{
    whoami = QUtil::getWhoami(argv[0]);

    // For libtool's sake....
    if (strncmp(whoami, "lt-", 3) == 0)
    {
	    whoami += 3;
    }

    if (argc < 3 || argc > 4)
    {
	    usage();
    }

    char const* infilename = argv[1];
    char const* outfilename = argv[2];
    std::vector<int> options = {2, 0, 0};

    try
    {
        if(argc > 3) 
        {
            options[0] = QUtil::string_to_int(argv[3]);
        }
        QPDF pdf;
        pdf.processFile(infilename);
            std::vector<QPDFPageObjectHelper> pages =
                QPDFPageDocumentHelper(pdf).getAllPages();
            for (std::vector<QPDFPageObjectHelper>::iterator iter = pages.begin();
                iter != pages.end(); ++iter)
            {
                // Attach token filter to each page of this file.
                // When the file is written, or when the pages' contents
                // are retrieved in any other way, the filter will be
                // applied.
                QPDFPageObjectHelper& page(*iter);
                page.addContentTokenFilter(new DarkFilter(page, options));
            }

            QPDFWriter w(pdf, outfilename);
            w.setStaticID(true);    // for testing only
            w.write();
    }
    catch (std::exception& e)
    {
        std::cerr << whoami << ": " << e.what() << std::endl;
        exit(2);
    }

    return 0;
}
